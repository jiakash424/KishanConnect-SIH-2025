import Image from 'next/image';
import {
  Sprout,
  FlaskConical,
  Bug,
  Landmark,
  Lightbulb,
  Droplets,
  Tractor,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { LandingHeader } from '@/components/landing/header';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    name: 'AI Diagnostics',
    description: 'Upload an image of a plant to identify diseases and pests, and get instant treatment advice.',
    icon: Sprout,
    href: '/login?redirect_to=/dashboard/diagnostics',
  },
  {
    name: 'Soil Analysis',
    description: 'Analyze soil health by uploading an image and receive recommendations for crops and improvements.',
    icon: FlaskConical,
    href: '/login?redirect_to=/dashboard/soil-analysis',
  },
  {
    name: 'Pest Prediction',
    description: 'Get weather-based forecasts for pest and disease risks to take timely preventative action.',
    icon: Bug,
    href: '/login?redirect_to=/dashboard/pest-prediction',
  },
  {
    name: 'Crop Advisor',
    description: 'Receive AI-powered crop recommendations based on your soil, budget, and location for maximum profitability.',
    icon: Lightbulb,
    href: '/login?redirect_to=/dashboard/crop-advisor',
  },
  {
    name: 'Market Prices',
    description: 'Stay updated with real-time market prices for various crops from different markets across India.',
    icon: Landmark,
    href: '/login?redirect_to=/dashboard/market',
  },
  {
    name: 'Smart Irrigation',
    description: 'Generate a 7-day, weather-based irrigation schedule to optimize water usage and improve crop yield.',
    icon: Droplets,
    href: '/login?redirect_to=/dashboard/irrigation-schedule',
  },
];

const stats = [
    { name: 'Farmers Connected', value: '15K+' },
    { name: 'Increased Income', value: '85%' },
    { name: 'Market Partners', value: '200+' },
    { name: 'Agri-Experts', value: '50+' },
]

export default function LandingPage() {
    const heroBg = PlaceHolderImages.find(p => p.id === 'login-background');
  return (
    <div className="text-gray-900">
      <LandingHeader />

      <main>
        {/* Hero Section */}
        <div className="relative">
             {heroBg && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={heroBg.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        priority
                        data-ai-hint={heroBg.imageHint}
                    />
                    <div className="absolute inset-0 bg-primary/70"></div>
                </div>
            )}
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
                 <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                    Connecting Farmers to <span className="text-accent">Success</span>
                </h1>
                <p className="mx-auto mt-6 max-w-lg text-xl text-green-100 sm:max-w-3xl">
                    Empowering farmers with AI-driven insights, real-time data, and a connected community to revolutionize agriculture.
                </p>
                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                    <Button size="lg" asChild>
                        <Link href="/login">Get Started</Link>
                    </Button>
                </div>
            </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.name} className="bg-green-50 rounded-xl p-6 text-center shadow-sm transition hover:bg-primary hover:text-white group">
                            <p className="text-3xl font-bold text-primary group-hover:text-white md:text-4xl">{stat.value}</p>
                            <p className="mt-2 text-gray-600 group-hover:text-green-100">{stat.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 bg-green-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold uppercase tracking-wide text-primary">
                Our Features
              </h2>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to grow
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
                KrishiConnect provides a suite of AI-powered tools to help you
                make smarter farming decisions.
              </p>
            </div>

            <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                 <Card key={feature.name} className="transform transition duration-300 hover:scale-105 hover:shadow-2xl bg-card">
                   <Link href={feature.href} className="flex flex-col h-full">
                      <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="pt-4">{feature.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-secondary">
            <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
                 <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    Ready to transform your farming business?
                </h2>
                <p className="mt-4 text-lg text-green-100">
                    Join thousands of farmers already using KrishiConnect to increase their income and grow their operations.
                </p>
                <div className="mt-8">
                     <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100" asChild>
                        <Link href="/login">Get Started Today</Link>
                    </Button>
                </div>
            </div>
        </div>
      </main>

      {/* Footer */}
        <footer className="bg-dark text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <Sprout className="h-8 w-8 text-primary" />
                                <span className="text-2xl font-bold text-white">
                                    Krishi<span className="text-accent">Connect</span>
                                </span>
                            </Link>
                        </div>
                        <p className="mt-4 text-gray-400">
                            Empowering farmers with technology to grow their agricultural business and improve their livelihoods.
                        </p>
                         <div className="mt-6 flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Linkedin /></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Solutions</h3>
                        <ul className="mt-4 space-y-2">
                            {features.map(f => (
                               <li key={f.name}><a href={f.href} className="text-gray-400 hover:text-white">{f.name}</a></li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold">Company</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                            <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">Contact</h3>
                        <ul className="mt-4 space-y-3 text-gray-400">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                                <span>RKGIT ghaizabad</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 mr-2" />
                                <span>+91 9411621096</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 mr-2" />
                                <span>jiakash427@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} KrishiConnect. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
  );
}
