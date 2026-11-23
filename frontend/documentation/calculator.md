# Packaging calculator

## Current mode

The provided site used a client-side formula and static prices, but no approved commercial rate card or confirmed MOQ was supplied. The rebuilt tool therefore runs in **quotation mode**. It collects and stores real specifications without making up a selling price, lead time, load rating or minimum order quantity.

Steps: product, style, dimensions/units, material, printing and finish, quantity, review, customer information. The browser retains specification choices in session storage, excluding customer contact details. A successful submission clears that saved specification. Navigation uses Back/Continue controls and validates relevant inputs.

## Backend validation

Options must be in the public option lists and belong to the selected product. Dimensions are positive, unit-converted and checked against software caps. Quantity is a positive integer below the configured software ceiling. Duplicate finishing options are rejected. The server recalculates when saving; browser prices are never accepted.

## Approved-rate integration

`CalculatorSetting.rates` is excluded from public reads. A future authorised configuration may set `pricingVerified: true` only after the business approves and versions a rate card. Each product rate needs:

```text
verifiedAt                  Approval timestamp
materials[]                 Covered material option values
styles[]                    Covered style option values
printing[]                  Covered print option values
materialPerSquareMetre      Non-negative approved material rate
printingPerUnit             Non-negative approved print component
finishingPerUnit{}           Explicit rate for every supported selected finish
otherPerUnit                Non-negative approved component
setupCost                   Non-negative approved setup component
minimumQuantity             Approved quantity floor for that rate
wasteFactor                 Approved area factor, at least 1
```

The current guarded engine demonstrates separate material/print/finish/setup components using a surface-area basis. **The company must approve or replace that basis and every parameter before enabling monetary output.** It is not asserted to be the company's actual commercial model. Unsupported style/material/print/finish combinations require a reviewed quotation. Do not enable a single uniform rate for combinations it does not cover.

An approved calculation returns rounded unit/total amounts, currency, specification and disclaimer. Pricing rules remain on the server. This is still an estimate, not an accepted order.
