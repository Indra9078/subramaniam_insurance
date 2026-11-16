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

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <Marquee
        items={[
          "LIC",
          "Star Health Insurance",
          "IFFCO-Tokio General Insurance",
          dict.marquee,
        ]}
      />
      <main className="flex-1">
        <Services lang={lang} dict={dict} />
        <HowItWorks dict={dict} />
        <WhyTrust dict={dict} />
        <Listings lang={lang} dict={dict} />
        <Testimonials dict={dict} />
        <Faq
          lang={lang}
          viewAll={dict.faq.viewAll}
          title={dict.faq.title}
          answer={dict.faq.answer}
          items={dict.faq.items}
        />
        <Contact dict={dict} />
      </main>
      <Footer lang={lang} nav={dict.nav} footer={dict.footer} />
    </>
  );
}
