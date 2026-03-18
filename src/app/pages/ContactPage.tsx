import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { MapPin, Phone, Mail, Clock, Facebook } from "lucide-react";
import { motion } from "motion/react";
import type { ContactMessage } from "../content/types";
import { createPublicContactMessage } from "../content/api";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload: ContactMessage = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        subject: formData.subject,
        message: formData.message,
        status: "new",
        notes: "",
      };
      await createPublicContactMessage(payload);
      alert(
        `Message Sent!\n\nThank you ${formData.name}!\n\nWe've received your message and will respond within 24 hours via email or WhatsApp.`
      );
    } catch (err: any) {
      alert(err?.message ?? "Failed to send message");
      return;
    } finally {
      setSubmitting(false);
    }
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: ["Pegasus Football Academy", "Badore, Ajah, Lekki", "Lagos, Nigeria"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+234-9034-6304-07", "(WhatsApp enabled)"],
      link: "tel:+2349034630407",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["pegasusfcacademy@gmail.com"],
      link: "mailto:pegasusfcacademy@gmail.com",
    },
    {
      icon: Clock,
      title: "Training Schedule",
      details: ["Fridays & Saturdays", "4:00 PM - 7:30 PM", "(Times vary by age group)"],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}hero-bg.jpg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Get in touch with Pegasus Football Academy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full shadow-lg hover:shadow-xl transition-shadow text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-secondary">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-gray-600 hover:text-primary transition"
                    >
                      {info.details.map((detail, i) => (
                        <div key={i} className="text-sm mb-1">{detail}</div>
                      ))}
                    </a>
                  ) : (
                    info.details.map((detail, i) => (
                      <div key={i} className="text-sm text-gray-600 mb-1">{detail}</div>
                    ))
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8 shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-secondary">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+234-XXX-XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Inquiry Type *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="registration">Registration</SelectItem>
                        <SelectItem value="trial">Trial Booking</SelectItem>
                        <SelectItem value="sponsorship">Sponsorship</SelectItem>
                        <SelectItem value="media">Media Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">Your Message *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={submitting}>
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Map & Social Media */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Map */}
              <Card className="overflow-hidden shadow-xl">
                <div className="aspect-video bg-gray-200 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7279707932577!2d3.6073!3d6.4400!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjYnMjQuMCJOIDPCsDM2JzI2LjMiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Pegasus Football Academy Location"
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-secondary mb-2">Find Us</h3>
                  <p className="text-sm text-gray-600">
                    Located in Badore, Ajah, Lekki axis of Lagos, Nigeria
                  </p>
                </div>
              </Card>

              {/* Social Media */}
              <Card className="p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-secondary">Follow Us</h3>
                <div className="space-y-4">
                  <a
                    href="https://facebook.com/share/1ZmkJ86wXN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-primary/10 transition"
                  >
                    <Facebook className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-semibold text-secondary">Facebook</div>
                      <div className="text-sm text-gray-600">@pegasusfootballacademy</div>
                    </div>
                  </a>
                  <a
                    href="https://www.tiktok.com/@pegasus_football_academy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-primary/10 transition"
                  >
                    <div className="w-6 h-6 text-primary text-xl">🎵</div>
                    <div>
                      <div className="font-semibold text-secondary">TikTok</div>
                      <div className="text-sm text-gray-600">@pegasus_football_academy</div>
                    </div>
                  </a>
                </div>
              </Card>

              {/* Quick Contact */}
              <Card className="p-6 bg-gradient-to-br from-primary to-accent text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4">Prefer to Call or WhatsApp?</h3>
                <p className="mb-4 text-white/90">
                  Get instant responses to your questions via phone or WhatsApp
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+2349034630407"
                    className="block bg-white text-primary px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition"
                  >
                    📞 Call: +234-9034-6304-07
                  </a>
                  <a
                    href="https://wa.me/2349034630407?text=Hello%20Pegasus%20Academy%2C%20I'm%20interested%20in%20learning%20more"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-green-600 transition"
                  >
                    💬 WhatsApp Us
                  </a>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Directions */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-secondary">
              How to Get Here
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  from: "From Victoria Island",
                  directions: "Take Lekki-Epe Expressway towards Ajah, exit at Badore junction",
                },
                {
                  from: "From Lekki Phase 1",
                  directions: "Follow Admiralty Way to Lekki-Epe Expressway, continue to Badore",
                },
                {
                  from: "From Ajah",
                  directions: "Head towards Badore area, ask for Pegasus Football Academy pitch",
                },
              ].map((route, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-bold text-secondary mb-2">{route.from}</h3>
                  <p className="text-sm text-gray-600">{route.directions}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
