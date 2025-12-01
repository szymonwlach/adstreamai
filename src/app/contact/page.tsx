// "use client";
// import React, { useState } from "react";
// import {
//   Mail,
//   Send,
//   CheckCircle,
//   AlertCircle,
//   CircleChevronLeft,
// } from "lucide-react";

// interface ContactProps {
//   companyName?: string;
//   contactEmail?: string;
// }

// const Contact: React.FC<ContactProps> = ({
//   companyName = "AdStreamAI",
//   contactEmail = "contact@adstreamai.com",
// }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // const handleChange = (
//   //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   // ) => {
//   //   setFormData({
//   //     ...formData,
//   //     [e.target.name]: e.target.value,
//   //   });
//   //   // Clear error when user starts typing
//   //   if (error) setError(null);
//   // };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setIsSubmitting(true);
//   //   setError(null);

//   //   try {
//   //     const response = await fetch("/api/contact", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify(formData),
//   //     });

//   //     const data = await response.json();

//   //     if (!response.ok) {
//   //       throw new Error(data.error || "Failed to send message");
//   //     }

//   //     setIsSubmitted(true);

//   //     // Reset formularza po 4 sekundach
//   //     setTimeout(() => {
//   //       setIsSubmitted(false);
//   //       setFormData({ name: "", email: "", subject: "", message: "" });
//   //     }, 4000);
//   //   } catch (err) {
//   //     setError(
//   //       err instanceof Error
//   //         ? err.message
//   //         : "Something went wrong. Please try again."
//   //     );
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };

//   return (
//     <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
//       <div className="absolute top-5 left-5">
//         <a
//           href="/#footer"
//           className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
//         >
//           <CircleChevronLeft size={30} />
//         </a>
//       </div>
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
//           <p className="text-slate-400 text-lg">
//             Have questions? We'd love to hear from you.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Contact Info Card */}
//           <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-slate-800">
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-white mb-4">
//                 Contact Information
//               </h2>
//               <p className="text-slate-400">
//                 Reach out to us and we'll respond as soon as possible.
//               </p>
//             </div>

//             <div className="space-y-6">
//               {/* Email */}
//               <div className="flex items-start gap-4">
//                 <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
//                   <Mail className="w-6 h-6 text-blue-400" />
//                 </div>
//                 <div>
//                   <h3 className="text-white font-medium mb-1">Email</h3>
//                   <a
//                     href={`mailto:${contactEmail}`}
//                     className="text-blue-400 hover:text-blue-300 transition-colors"
//                   >
//                     {contactEmail}
//                   </a>
//                 </div>
//               </div>

//               {/* Support Info */}
//               <div className="pt-6 border-t border-slate-800">
//                 <h3 className="text-white font-medium mb-3">Support Hours</h3>
//                 <p className="text-slate-400 text-sm">
//                   Monday - Friday: 9:00 AM - 6:00 PM (EST)
//                 </p>
//                 <p className="text-slate-400 text-sm mt-1">
//                   We typically respond within 24 hours
//                 </p>
//               </div>

//               {/* Quick Links */}
//               <div className="pt-6 border-t border-slate-800">
//                 <h3 className="text-white font-medium mb-3">Quick Links</h3>
//                 <div className="space-y-2">
//                   <a
//                     href="/terms"
//                     className="block text-slate-400 hover:text-blue-400 text-sm transition-colors"
//                   >
//                     Terms & Conditions
//                   </a>
//                   <a
//                     href="/privacy"
//                     className="block text-slate-400 hover:text-blue-400 text-sm transition-colors"
//                   >
//                     Privacy Policy
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contact Form Card */}
//           <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-slate-800">
//             <h2 className="text-2xl font-semibold text-white mb-6">
//               Send us a Message
//             </h2>

//             {isSubmitted ? (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
//                   <CheckCircle className="w-8 h-8 text-green-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">
//                   Message Sent!
//                 </h3>
//                 <p className="text-slate-400 text-center">
//                   Thank you for contacting us. We'll get back to you soon.
//                 </p>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {error && (
//                   <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
//                     <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
//                     <p className="text-red-300 text-sm">{error}</p>
//                   </div>
//                 )}

//                 <div>
//                   <label
//                     htmlFor="name"
//                     className="block text-sm font-medium text-slate-300 mb-2"
//                   >
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
//                     placeholder="Your name"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block text-sm font-medium text-slate-300 mb-2"
//                   >
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
//                     placeholder="your.email@example.com"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="subject"
//                     className="block text-sm font-medium text-slate-300 mb-2"
//                   >
//                     Subject
//                   </label>
//                   <input
//                     type="text"
//                     id="subject"
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
//                     placeholder="What's this about?"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="message"
//                     className="block text-sm font-medium text-slate-300 mb-2"
//                   >
//                     Message
//                   </label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     rows={5}
//                     className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none"
//                     placeholder="Tell us more..."
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       Sending...
//                     </>
//                   ) : (
//                     <>
//                       <Send className="w-5 h-5" />
//                       Send Message
//                     </>
//                   )}
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>

//         {/* FAQ Section */}
//         <div className="mt-12 bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-slate-800">
//           <h2 className="text-2xl font-semibold text-white mb-6">
//             Frequently Asked Questions
//           </h2>
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-white font-medium mb-2">
//                 How long does it take to generate videos?
//               </h3>
//               <p className="text-slate-400 text-sm">
//                 Video generation typically takes 2-5 minutes depending on the
//                 complexity and style selected.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-white font-medium mb-2">
//                 What platforms do you support?
//               </h3>
//               <p className="text-slate-400 text-sm">
//                 We support TikTok, Instagram, Facebook, YouTube Shorts, and
//                 LinkedIn with automatic optimization for each platform.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-white font-medium mb-2">
//                 How do credits work?
//               </h3>
//               <p className="text-slate-400 text-sm">
//                 Each video style you select uses 1 credit. You can purchase
//                 additional credits or upgrade to a plan with more included
//                 credits.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-white font-medium mb-2">
//                 Can I cancel my subscription?
//               </h3>
//               <p className="text-slate-400 text-sm">
//                 Yes, you can cancel anytime from your account settings. You'll
//                 retain access until the end of your billing period.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;
import React from "react";

const Contact = () => {
  return <div>Contact</div>;
};

export default Contact;
