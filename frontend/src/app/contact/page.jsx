import { content } from '@/lib/api';
import { PageHero, FAQ, SectionHeading } from '@/components/UI';
import LeadForm from '@/components/LeadForm';
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';
export const metadata = {
  title: 'Contact Us | Paras Prints Solutions, Ghaziabad',
  description:
    'Contact Paras Prints Solutions for custom packaging and commercial printing enquiries. Call, email, WhatsApp or send your requirements.',
  alternates: { canonical: '/contact' },
};
export default async function Contact() {
  const settings = await content('/settings/public');
  const c = settings.company;
  return (
    <>
      <PageHero
        eyebrow="A DIRECT CONVERSATION"
        title="Tell us what you’re working on."
        lead="A new pack, a revised specification or a commercial print requirement. Start a conversation with the Paras Prints Solutions team."
        crumbs={[{ label: 'Contact' }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <div className="contact-details">
                <div>
                  <Phone size={22} />
                  <h2>Call the team</h2>
                  <a href={c.phoneHref}>{c.phone}</a>
                </div>
                <div>
                  <Mail size={22} />
                  <h2>Send an email</h2>
                  <a href={c.emailHref}>{c.email}</a>
                </div>
                <div>
                  <MapPin size={22} />
                  <h2>Published business address</h2>
                  <address>{c.address}</address>
                  <p>{c.addressNote}</p>
                  <a
                    href={
                      'https://www.google.com/maps/search/?api=1&query=' +
                      encodeURIComponent(c.address)
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    Search the published address <ArrowUpRight size={16} />
                  </a>
                </div>
                <a
                  className="button button--outline"
                  href={c.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  Talk on WhatsApp <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
            <div className="col-lg-7">
              <h2 className="form-title">Send your enquiry</h2>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading eyebrow="BEFORE YOU SEND" title="A few useful answers." />
          <FAQ
            items={settings.faqs.filter((f) =>
              ['Quotation', 'Delivery', 'Manufacturing'].includes(f.category),
            )}
          />
        </div>
      </section>
    </>
  );
}
