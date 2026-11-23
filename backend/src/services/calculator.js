import { CalculatorSetting } from '../models/index.js';
import { ApiError } from '../utils/errors.js';
export async function calculate(config) {
  const settings = await CalculatorSetting.findOne({ key: 'default' }).select('+rates').lean();
  if (!settings || !settings.products.includes(config.product))
    throw new ApiError(422, 'Select a supported packaging product.');
  for (const [field, list] of [
    ['style', 'styles'],
    ['material', 'materials'],
    ['printing', 'printing'],
  ]) {
    if (
      !settings[list].some((o) => o.value === config[field] && o.products.includes(config.product))
    )
      throw new ApiError(422, `Select a valid ${field} for this product.`, {
        [field]: 'This option is not available for the selected product.',
      });
  }
  if (
    new Set(config.finishing).size !== config.finishing.length ||
    config.finishing.some(
      (value) =>
        !settings.finishing.some((o) => o.value === value && o.products.includes(config.product)),
    )
  )
    throw new ApiError(422, 'Select valid finishing options.');
  const factor = { mm: 1, cm: 10, in: 25.4 }[config.unit];
  if (
    [config.length, config.width, config.height].some(
      (n) => n * factor > settings.maxDimensionMm,
    ) ||
    config.quantity > settings.maxQuantity
  )
    throw new ApiError(
      422,
      'The entered dimensions or quantity exceed the calculator limits. Contact us for this requirement.',
    );
  // No price is displayed until a business-approved, versioned rate card is supplied.
  const rates = settings.rates?.[config.product];
  if (!settings.pricingVerified || !rates?.verifiedAt)
    return {
      mode: 'quotation',
      configuration: config,
      message:
        'Your specifications are ready. Our team will prepare a quotation after reviewing the material, artwork and delivery requirements.',
      disclaimer: settings.disclaimer,
    };
  const rateKeys = ['materialPerSquareMetre', 'printingPerUnit', 'setupCost', 'otherPerUnit'];
  if (
    rateKeys.some((key) => !Number.isFinite(rates[key]) || rates[key] < 0) ||
    !Number.isFinite(rates.wasteFactor) ||
    rates.wasteFactor < 1 ||
    !Number.isFinite(rates.minimumQuantity) ||
    config.quantity < rates.minimumQuantity
  )
    throw new ApiError(422, 'A reviewed quotation is required for these specifications.');
  if (
    !rates.materials?.includes(config.material) ||
    !rates.styles?.includes(config.style) ||
    !rates.printing?.includes(config.printing)
  )
    throw new ApiError(422, 'A reviewed quotation is required for these specifications.');
  if (
    config.finishing.some(
      (f) => !Number.isFinite(rates.finishingPerUnit?.[f]) || rates.finishingPerUnit[f] < 0,
    )
  )
    throw new ApiError(422, 'Finishing requires a reviewed quotation.');
  const [l, w, h] = [config.length, config.width, config.height].map((n) => (n * factor) / 1000);
  const area = 2 * (l * w + l * h + w * h) * rates.wasteFactor;
  const material = area * rates.materialPerSquareMetre;
  const finishing = config.finishing.reduce((sum, key) => sum + rates.finishingPerUnit[key], 0);
  const unit =
    material +
    rates.printingPerUnit +
    finishing +
    rates.otherPerUnit +
    rates.setupCost / config.quantity;
  return {
    mode: 'estimate',
    configuration: config,
    unitCost: Math.round(unit * 100) / 100,
    totalCost: Math.round(unit * config.quantity * 100) / 100,
    currency: settings.currency,
    disclaimer: settings.disclaimer,
  };
}
