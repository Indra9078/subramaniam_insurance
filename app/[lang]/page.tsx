import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { Footer } from "@/components/layout/Footer";
import { Marquee } from "@/components/ui/Marquee";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyTrust } from "@/components/home/WhyTrust";
import { Listings } from "@/components/home/Listings";
import { Testimonials } from "@/components/home/Testimonials";
import { Faq } from "@/components/home/Faq";
import { Contact } from "@/components/home/Contact";
import { getFaqs, getListings, getTestimonials } from "@/lib/data";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, listings, faqs, testimonials] = await Promise.all([
    getDictionary(lang),
    getListings(),
    getFaqs(),
    getTestimonials(),
  ]);

  return (
    <>
      <main id="main" className="flex flex-1 flex-col">
      <Hero lang={lang} dict={dict} />
      <Marquee
        items={[
          "LIC",
          "Star Health Insurance",
          "IFFCO-Tokio General Insurance",
          dict.marquee,
        ]}
      />
      <div className="flex-1">
        <Services lang={lang} dict={dict} />
        <HowItWorks dict={dict} />
        <WhyTrust dict={dict} />
        <Listings lang={lang} dict={dict} listings={listings} />
        <Testimonials lang={lang} dict={dict} testimonials={testimonials} />
        <Faq
          lang={lang}
          viewAll={dict.faq.viewAll}
          title={dict.faq.title}
          empty={dict.faq.empty}
          faqs={faqs}
        />
        <Contact lang={lang} dict={dict} />
      </div>
</main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
