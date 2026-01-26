# 🎬 AdStream – AI Shorts SaaS Platform

**AdStream** is a professional, production-ready SaaS platform that automates the creation of short-form video content (Shorts, Reels, TikTok) using state-of-the-art AI. It transforms static images and form selections into viral videos.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-008cdd?style=for-the-badge&logo=stripe)
![n8n](https://img.shields.io/badge/n8n-Workflow_Automation-FF6D5A?style=for-the-badge&logo=n8n)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Components-000000?style=for-the-badge&logo=shadcnui)

---

## 🚀 AI Engine & Integration

AdStream leverages a powerful combination of tools to deliver high-quality automation:

- **Sora 2 Pro**: Cinematic-grade image-to-video generation.
- **GPT-4o**: Intelligent orchestration and metadata generation.
- **n8n**: The automation "brain" connecting the form data with AI models.

---

## 🔥 Key Features

- **Visual Generation Engine**: Create videos by simply uploading an image and selecting options from a tailored form.
- **Smart Form UI**: User-friendly interface built with **shadcn/ui** for picking video styles, tones, and formats.
- **Monetization**: Integrated **Stripe** for subscriptions and credit-based systems.
- **Automated Workflows**: Advanced **n8n** pipelines that handle the heavy lifting of video processing.
- **Secure Auth**: User onboarding and management via **Supabase Auth**.
- **Cloud Asset Management**: Reliable storage for your generated shorts on **Supabase Storage**.

---

## ⚙️ How It Works (The Workflow)

1.  **Subscription**: User selects a plan via **Stripe**.
2.  **Configuration**: User uploads at least one image and selects video parameters (style, duration, etc.) through a structured form.
3.  **Automation**: **Next.js** triggers an **n8n** webhook, passing the image and form data.
4.  **AI Generation**: **n8n** orchestrates **Sora 2 Pro** to animate the image and **GPT-4o** to refine the context.
5.  **Delivery**: The final AI Short is rendered, stored in **Supabase**, and displayed in the user dashboard.

---

## 🛠 Tech Stack

### Frontend

- **Next.js 15 (App Router)** – React framework.
- **TypeScript** – Full type safety.
- **shadcn/ui** – High-quality, accessible UI components.
- **Tailwind CSS** – Utility-first styling.

### Backend & Payments

- **Supabase** – Database (PostgreSQL), Auth, and Storage.
- **Stripe** – Payment processing and subscription management.
- **n8n** – Workflow automation engine.

---

## 🚀 Getting Started

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/szymonwlach/adstream.git](https://github.com/szymonwlach/adstream.git)
    cd adstream
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env.local` file:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    STRIPE_SECRET_KEY=your_stripe_key
    STRIPE_WEBHOOK_SECRET=your_webhook_secret
    N8N_WEBHOOK_URL=your_n8n_url
    ```

4.  **Run Dev Server:**
    ```bash
    npm run dev
    ```

---

## 🤝 Contact & Author

**Szymon Włach** 📧 [szymonwlach.dev@gmail.com](mailto:szymonwlach.dev@gmail.com)  
🔗 [github.com/szymonwlach](https://github.com/szymonwlach)
