# 🎬 AdStream – AI Shorts SaaS Platform

**AdStream** is a professional, production-ready SaaS platform that automates the creation of short-form video content (Shorts, Reels, TikTok) using state-of-the-art AI. Turn ideas into viral videos in seconds.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-008cdd?style=for-the-badge&logo=stripe)
![n8n](https://img.shields.io/badge/n8n-Workflow_Automation-FF6D5A?style=for-the-badge&logo=n8n)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Components-000000?style=for-the-badge&logo=shadcnui)

---

## 🚀 AI Engine & Integration

AdStream leverages a powerful combination of tools to deliver high-quality automation:

- **Sora 2 Pro**: Cinematic-grade video generation.
- **GPT-4o**: Intelligent scriptwriting and workflow orchestration.
- **n8n**: The automation "brain" connecting AI models with the application logic.

---

## 🔥 Key Features

- **AI Video Generation**: Full automation from text prompt to rendered video.
- **Monetization**: Integrated **Stripe** for subscriptions and credit-based systems.
- **Enterprise UI**: Beautifully crafted components using **shadcn/ui** and **Tailwind CSS**.
- **Automated Workflows**: Advanced **n8n** pipelines for content processing.
- **Secure Auth**: User onboarding and management via **Supabase Auth**.
- **Database & Storage**: Reliable PostgreSQL hosting and asset storage on **Supabase**.

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

## ⚙️ Workflow Architecture

1.  **User Action**: User selects a plan (Stripe) and enters a prompt.
2.  **Request**: Next.js triggers an **n8n** webhook.
3.  **Generation**: n8n calls **GPT-4o** for the script and **Sora 2 Pro** for the visuals.
4.  **Completion**: The video is stored in Supabase, and the user's credit balance is updated.

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
