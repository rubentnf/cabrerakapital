# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences with equal weight (confirmed):

- **Particulares** who are buying a home or want to improve the mortgage they already have, mostly in Tenerife and the rest of the Canary Islands.
- **Pymes and autónomos** who need business financing.

A real share of visitors are older people or people with little digital confidence. They need to understand at a glance what the firm does and how to contact it, without having to guess how the page works.

## Product Purpose

Cabrera Kapital is an independent credit intermediary (*intermediario de crédito inmobiliario*). It studies each case, negotiates with several banks on the client's behalf and accompanies the client until signing. The website exists to turn a visitor into a contact. Success means one of these confirmed actions:

1. Request the free assessment through the contact form (the main action).
2. Use the mortgage simulator (chat format).
3. Phone one of the partners.

WhatsApp is also available, but the client did not name it as a goal.

## Positioning

- **Former bank insiders:** the partners spent more than 20 years in Canarian banking, running branches, analysing risk and deciding which deals went ahead. Their message: "We know banking from the inside. Now we negotiate for you."
- **Independent, success-based fee:** they are not tied to any bank. They are paid only by the client, and only if the deal is signed (0 € otherwise).
- **Registered and accredited:** registered with the Banco de España (E593), with LCCI accreditation (Ley 5/2019) and EFPA EIP certification.
- **Local:** a real office in La Laguna (C/ Santa Eulalia 9).

## Operating Context

- **How visitors engage:** they arrive mostly on mobile or a typical office desktop. They compare options and often decide by talking to a person (phone or a meeting at the office).
- **What the site offers:** a bilingual site (ES/EN; in legal texts the Spanish version prevails) and a 5-step "how we work" process. The services are buying a home, improving a mortgage, business financing and investing.
- **Required legal documents:**
  - información previa al cliente;
  - declaración de independencia;
  - información sobre remuneración;
  - cláusula de exención de responsabilidad;
  - aviso legal;
  - privacy and cookie policies.

  Each has a downloadable PDF.

## Capabilities and Constraints

- **Stack:** Astro static site deployed on a Cloudflare Worker. The Worker handles `/api/contacto` (Resend email) and `/api/resenas` (Google Places).
- **Features:**
  - contact form with a particular/pyme switch;
  - chat-style mortgage simulator;
  - Google reviews (manually chosen by the client);
  - video presentation;
  - map behind cookie consent;
  - light and dark themes;
  - WhatsApp and Instagram links.
- **Regulation:** Ley 5/2019 (real-estate credit), RGPD/LOPDGDD, and the LSSI with the AEPD cookie guide. Accept and reject must carry equal visual weight. Analytics is Cloudflare Web Analytics, which sets no cookies.
- **Changes to legal texts:** they need the client's gestoría to review them, and the PDFs must be regenerated.
- **Performance is a requirement:** recent PageSpeed results were 100 on desktop and about 96 on mobile. The scroll-driven hero animation must not delay the first paint.
- **Open decision:** the home headline says "Hipotecas y financiación para pymes" (an explicit client request), while the confirmed audience is particulares and pymes equally.

## Brand Commitments

- **Name and logo:** Cabrera Kapital, with the gold "CK" circular emblem (`src/assets/logo/ck-simbolo.png`).
- **Voice:** formal Spanish "usted", close but professional, plain words over financial jargon.
- **Client-approved home elements:**
  - eyebrow "Intermediario de crédito en Canarias", next to the gold archipelago silhouette;
  - large headline;
  - the claim "Conocemos la banca *por dentro*. Ahora negociamos por usted.";
  - three guarantees (20+ / 0 € / E593);
  - La Laguna city silhouette;
  - vertical video card.
- **Explicit client rejections:**
  - no Teide imagery;
  - no floating Instagram button;
  - the archipelago stays inline next to the eyebrow, not centred.

## Evidence on Hand

- **Partners:** Olegario Cabrera García and Alejandro Cabrera Martín, with real photos (`src/assets/photos/`: oficina, olegario, alejandro, equipo).
- **Google reviews:** five real 5-star reviews chosen by the client, with profile photos (`src/data/resenas.ts`). The total number of reviews is deliberately not shown.
- **Video:** presentation video `public/video/que-hacen-en-ck.mp4`.
- **Credentials:** Banco de España, EFPA and LCCI seals (`src/assets/sellos/`).
- **Banks:** logos of 19 partner banks, used with permission (`src/assets/logos/`).
- **Absences:** no case studies, client counts, approval rates or press exist. Do not invent figures, testimonials or claims beyond the ones above.

## Product Principles

1. **Trust before persuasion:** show real people, real credentials and real reviews. A credit intermediary is chosen for credibility, not for spectacle.
2. **One clear next step:** every page leads to the free assessment, with the simulator and the phone as alternatives.
3. **Nobody gets lost:** plain language, explicit instructions ("Siga bajando") and no interaction that looks broken or editable.
4. **Fast everywhere:** animation is welcome only when it never delays content or hides it.
5. **Faithful to the client's decisions:** treat client-approved elements as fixed and propose changes as options, never as silent replacements.

## Accessibility & Inclusion

- **Older users are a priority audience:**
  - generous text sizes;
  - large tap targets;
  - explicit labels rather than icon-only meaning;
  - `prefers-reduced-motion` fully respected (static page).
- **Standards:** WCAG 2.2 AA contrast in both the light and dark themes.
