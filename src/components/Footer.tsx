"use client";
import Link from "next/link";
import Mascot from "@/components/Mascot";

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-xl text-white mb-3">
            <span className="text-2xl">🐾</span> PAW<span className="text-berry">BERRY</span>
          </div>
          <p className="text-sm text-slate-400">
            Innovative, affordable products for dogs and cats. Designed with love, built to last.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products?category=interactive-toys" className="hover:text-white">Interactive Toys</Link></li>
            <li><Link href="/products?category=pet-houses" className="hover:text-white">Pet Houses</Link></li>
            <li><Link href="/products?category=cat-washrooms" className="hover:text-white">Cat Washrooms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#about" className="hover:text-white">About</Link></li>
            <li><Link href="/#contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/orders" className="hover:text-white">Track Order</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-white">Shipping & Returns</span></li>
            <li><span className="hover:text-white">FAQ</span></li>
            <li><span className="hover:text-white">Privacy Policy</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Mascot type="dog" size="sm" anim="peek" />
        © {new Date().getFullYear()} PAWBERRY. All rights reserved.
        <Mascot type="cat" size="sm" anim="peek" />
      </div>
    </footer>
  );
}
