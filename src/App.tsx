import React, { useState } from 'react';

export default function App() {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const WHATSAPP_NUMBER = "918478871737";
  
  const [formData, setFormData] = useState({
    name: '', phone: '', whatsapp: '', email: '', address: ''
  });

  // 1. UPDATED PRODUCTS WITH NEW PRICES & COMBOS
  const PRODUCTS = [
    { id: 1, name: 'Forest (Sundarban) Honey', price: 299, originalPrice: 350, weight: 500, img: 'forest-shop.png', tag: 'Wild' },
    { id: 2, name: 'Eucalyptus Honey', price: 450, originalPrice: 550, weight: 500, img: 'euca-shop.jpeg', tag: 'Aromatic' },
    { id: 3, name: 'Black Seeds Honey', price: 350, originalPrice: 400, weight: 500, img: 'black-shop.png', tag: 'Healing' },
    { id: 4, name: 'Forest + Eucalyptus Combo', price: 750, originalPrice: 900, weight: 1000, img: 'FH+EU.png', tag: 'Best Value' },
    { id: 5, name: 'Forest + Black Seed Combo', price: 700, originalPrice: 850, weight: 1000, img: 'FH+BS.png', tag: 'Health Pack' }
  ];

  const addToCart = (p: any) => {
    const existing = cart.find(item => item.id === p.id);
    if (existing) {
      setCart(cart.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ).filter(item => item.qty > 0));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // 2. UPDATED WHATSAPP HANDLER WITH UPI LINK & FREE DELIVERY LOGIC
  const handleWhatsAppOrder = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in your Name, Phone, and Address in the cart form.");
      return;
    }

    const UPI_ID = "918478871737@paytm"; 
    const BUSINESS_NAME = "Raw Honey Artisans";
    
    // Logic: Free delivery if Total Weight >= 1kg (1000g) AND Payment is Prepaid
    const totalWeight = cart.reduce((acc, item) => acc + (item.weight * item.qty), 0);
    const isEligibleForFreeDelivery = totalWeight >= 1000 && paymentMethod === 'Prepaid';
    const deliveryFee = isEligibleForFreeDelivery ? 0 : 50;
    const finalTotal = subtotal + deliveryFee;

    const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${finalTotal}&cu=INR`;

    let message = `*NEW ORDER FROM RAW HONEY*%0A%0A`;
    message += `*Items:*%0A`;
    cart.forEach(item => { 
      message += `- ${item.name} (${item.qty} x INR ${item.price})%0A`; 
    });
    
    message += `%0A*Subtotal:* INR ${subtotal}`;
    message += `%0A*Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : 'INR ' + deliveryFee}`;
    message += `%0A*Total Amount:* INR ${finalTotal}`;
    message += `%0A*Payment Method:* ${paymentMethod}`;
    
    if (paymentMethod === 'Prepaid') {
      message += `%0A%0A*⚡ QUICK PAY LINK:*%0A${upiLink}`;
      if (isEligibleForFreeDelivery) {
        message += `%0A_(Free Delivery Applied for 1kg+ Prepaid!)_`;
      }
    }

    message += `%0A%0A*Delivery Details:*%0A- Name: ${formData.name}%0A- Phone: ${formData.phone}%0A- Address: ${formData.address}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div id="home" className="bg-[#FAFAF5] font-sans text-[#1D1D1B] scroll-smooth">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      
      <style>{`
        .font-serif { font-family: 'Playfair Display', serif !important; }
        .font-sans { font-family: 'Inter', sans-serif !important; }
        @keyframes heartbeat { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .heart { display: inline-block; color: #ff4d4d; animation: heartbeat 1.5s infinite; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        .animate-bounce-slow { animation: bounce-slow 1.5s infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- CART DRAWER --- */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isCartOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full sm:max-w-lg bg-white shadow-2xl transition-transform duration-500 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto p-6 md:p-8 flex flex-col`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl md:text-3xl">Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-4xl">&times;</button>
          </div>
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-lg opacity-60 italic mb-4">Your cart is empty</p>
              <button onClick={() => setIsCartOpen(false)} className="bg-[#D4A373] text-white px-8 py-3 rounded-full font-bold">Continue Shopping</button>
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-8 border-b pb-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.img} className="w-16 h-16 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-xs opacity-50">INR {item.price}</p>
                    </div>
                    <div className="flex items-center border rounded-lg bg-gray-50 scale-90">
                      <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1">-</button>
                      <span className="px-2 font-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1">+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="font-serif text-xl border-b pb-2">Delivery</h3>
                <p className="text-[10px] text-[#D4A373] font-bold">🎁 PROMO: Buy 1kg+ (Prepaid) for FREE delivery!</p>
                <input type="text" placeholder="Full Name *" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input type="tel" placeholder="Phone *" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                <textarea placeholder="Delivery Address *" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl h-20 text-sm" onChange={(e) => setFormData({...formData, address: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                    <button onClick={() => setPaymentMethod('COD')} className={`p-2 border rounded-xl text-[10px] font-bold ${paymentMethod === 'COD' ? 'bg-stone-100 border-[#D4A373]' : 'bg-stone-50'}`}>Cash on Delivery</button>
                    <button onClick={() => setPaymentMethod('Prepaid')} className={`p-2 border rounded-xl text-[10px] font-bold ${paymentMethod === 'Prepaid' ? 'bg-stone-100 border-[#D4A373]' : 'bg-stone-50'}`}>Prepaid (UPI)</button>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t">
                <div className="flex justify-between font-bold mb-4 text-lg">
                  <span>Total:</span> 
                  <span>INR {subtotal + (cart.reduce((a, b) => a + (b.weight * b.qty), 0) >= 1000 && paymentMethod === 'Prepaid' ? 0 : 50)}</span>
                </div>
                <button onClick={handleWhatsAppOrder} className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold shadow-lg">Place Order via WhatsApp</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex flex-col md:flex-row justify-between items-center px-[5%] md:px-[8%] py-4 md:py-8 sticky top-0 bg-[#FAFAF5]/90 backdrop-blur-md z-50 gap-4">
        <div className="font-serif text-2xl md:text-3xl font-bold text-[#D4A373]">Raw Honey</div>
        <div className="flex overflow-x-auto no-scrollbar w-full md:w-auto justify-center gap-6 md:gap-10 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold opacity-60 pb-2 md:pb-0">
          <a href="#home" className="hover:text-[#D4A373] whitespace-nowrap">Home</a>
          <a href="#our-honey" className="hover:text-[#D4A373] whitespace-nowrap">Our Honey</a>
          <a href="#about" className="hover:text-[#D4A373] whitespace-nowrap">About</a>
          <a href="#shop" className="hover:text-[#D4A373] whitespace-nowrap">Shop</a>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="absolute right-[5%] top-5 md:static md:scale-110">
          🛒 <span className="absolute -top-2 -right-2 bg-[#D4A373] text-white text-[9px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center font-bold">{cart.reduce((a,b)=>a+b.qty,0)}</span>
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="px-2 md:px-4 mb-16 md:mb-24">
        <div className="relative w-full min-h-[500px] md:aspect-[1376/768] flex items-center justify-center overflow-hidden rounded-[30px] md:rounded-[50px] shadow-2xl bg-stone-900">
          <img src="hero-bg.png" className="absolute inset-0 w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-white text-center px-6 flex flex-col items-center">
            <p className="uppercase tracking-[0.3em] md:tracking-[0.5em] text-[9px] md:text-[11px] font-bold mb-4 md:mb-6 text-[#D4A373]">Pure & Artisanal</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-8xl mb-8 md:mb-10 leading-tight">Direct From <br className="hidden sm:block"/> The Farm</h1>
            <div className="flex flex-col items-center gap-6 md:gap-8">
              <a href="#shop" className="bg-[#D4A373] px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-xl hover:bg-white hover:text-[#D4A373] transition-all">Explore Honey</a>
              <a href="#our-honey" className="group flex flex-col items-center gap-2 opacity-60">
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
                <div className="animate-bounce-slow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 13l5 5 5-5" /><path d="M7 6l5 5 5-5" className="opacity-40" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* --- OUR HONEY SECTION --- */}
      <section id="our-honey" className="py-16 md:py-24 px-[5%] md:px-[8%] max-w-7xl mx-auto space-y-20 md:space-y-32">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-[#D4A373] font-bold tracking-[0.3em] text-[9px] mb-2 uppercase">Discover Our Collection</p>
          <h2 className="font-serif text-3xl md:text-5xl mb-6">Honey, As Nature Intended</h2>
        </div>

        {/* Forest */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="h-[300px] md:h-[500px] rounded-[30px] md:rounded-[50px] overflow-hidden shadow-xl bg-white flex items-center justify-center">
             <img src="forest-ig.png" className="max-w-full max-h-full object-contain p-4" />
          </div>
          <div className="space-y-4 md:space-y-6 text-center md:text-left">
            <h3 className="font-serif text-3xl md:text-4xl">Forest (Sundarban) Honey</h3>
            <p className="text-[#D4A373] font-bold italic text-sm">Wild. Untamed. Deeply Nourishing.</p>
            <p className="opacity-60 leading-relaxed text-sm md:text-base">Deep within the world's largest mangrove forest, traditional honey hunters brave the wild to harvest this liquid gold.</p>
            <div className="border-t pt-6 border-stone-200">
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1 text-[#D4A373]">Flavor Profile</p>
               <p className="font-serif text-lg italic">Rich, earthy with floral undertones</p>
            </div>
          </div>
        </div>

        {/* Eucalyptus */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="order-2 md:order-1 space-y-4 md:space-y-6 text-center md:text-left">
            <h3 className="font-serif text-3xl md:text-4xl">Eucalyptus Honey</h3>
            <p className="text-[#D4A373] font-bold italic text-sm">Breathe Easy. Heal Naturally.</p>
            <p className="opacity-60 leading-relaxed text-sm md:text-base">Sourced from vast eucalyptus groves where bees feast exclusively on aromatic blossoms.</p>
            <div className="border-t pt-6 border-stone-200">
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1 text-[#D4A373]">Flavor Profile</p>
               <p className="font-serif text-lg italic">Bold, slightly mentholated with herbal notes</p>
            </div>
          </div>
          <div className="order-1 md:order-2 h-[300px] md:h-[500px] rounded-[30px] md:rounded-[50px] overflow-hidden shadow-xl bg-white flex items-center justify-center">
             <img src="euca-ig.png" className="max-w-full max-h-full object-contain p-4" />
          </div>
        </div>

        {/* Black Seeds */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="h-[300px] md:h-[500px] rounded-[30px] md:rounded-[50px] overflow-hidden shadow-xl bg-white flex items-center justify-center">
             <img src="black-ig.png" className="max-w-full max-h-full object-contain p-4" />
          </div>
          <div className="space-y-4 md:space-y-6 text-center md:text-left">
            <h3 className="font-serif text-3xl md:text-4xl">Black Seeds Honey</h3>
            <p className="text-[#D4A373] font-bold italic text-sm">The Ancient Remedy. Reimagined.</p>
            <p className="opacity-60 leading-relaxed text-sm md:text-base">A powerful fusion of pure raw honey and Nigella sativa (black seed/kalonji).</p>
            <div className="border-t pt-6 border-stone-200">
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1 text-[#D4A373]">Flavor Profile</p>
               <p className="font-serif text-lg italic">Warm, peppery with a hint of sweetness</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-20 md:py-32 px-[5%] md:px-[8%] bg-stone-100 rounded-[40px] md:rounded-[60px] mx-2 md:mx-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#D4A373] font-bold tracking-[0.3em] text-[9px] mb-4 uppercase">Our Promise</p>
          <h2 className="font-serif text-3xl md:text-5xl mb-12 md:mb-16">Nature's Purest Gift</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-8 md:p-12 rounded-[30px] md:rounded-[40px] shadow-sm border border-stone-200">
               <div className="text-3xl mb-4">🍯</div>
               <h3 className="font-serif text-xl md:text-2xl mb-2">100% Raw</h3>
               <p className="opacity-50 text-xs md:text-sm">Unprocessed, unheated, and unfiltered.</p>
            </div>
            <div className="bg-white p-8 md:p-12 rounded-[30px] md:rounded-[40px] shadow-sm border border-stone-200">
               <div className="text-3xl mb-4">🚜</div>
               <h3 className="font-serif text-xl md:text-2xl mb-2">Farm Direct</h3>
               <p className="opacity-50 text-xs md:text-sm">Sourced directly from beekeepers.</p>
            </div>
            <div className="bg-white p-8 md:p-12 rounded-[30px] md:rounded-[40px] shadow-sm border border-stone-200">
               <div className="text-3xl mb-4">🔬</div>
               <h3 className="font-serif text-xl md:text-2xl mb-2">Pure</h3>
               <p className="opacity-50 text-xs md:text-sm">Tested for purity and quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SHOP SECTION --- */}
      <section id="shop" className="py-20 md:py-32 px-[5%] md:px-[8%] max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl text-center mb-4">Choose Your Honey</h2>
        <p className="text-center text-[#D4A373] font-bold mb-12 uppercase tracking-widest text-xs">🎁 Promo: Buy 1kg+ (Prepaid) for FREE delivery!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="bg-white rounded-[30px] md:rounded-[40px] p-2 group transition-all duration-500 hover:shadow-xl">
              <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-[28px] md:rounded-[38px] bg-[#f9f9f9] flex items-center justify-center p-6">
                <img src={p.img} className="max-w-full max-h-full object-contain group-hover:scale-105 transition duration-700" alt="" />
                <span className="absolute top-6 left-6 bg-white/90 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{p.tag}</span>
              </div>
              <div className="flex flex-col px-4 py-6 md:py-8 text-center">
                <h3 className="font-serif text-xl md:text-2xl mb-4 h-12 flex items-center justify-center">{p.name}</h3>
                <div className="flex justify-between items-center border-t pt-4 border-stone-100">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] opacity-30 line-through">INR {p.originalPrice}</span>
                    <span className="text-xl font-bold text-[#D4A373]">INR {p.price}</span>
                  </div>
                  <button onClick={() => addToCart(p)} className="bg-[#D4A373] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all hover:scale-105">Add Jar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1D1D1B] text-white pt-20 pb-12 px-[8%] rounded-t-[40px] md:rounded-t-[60px] text-center">
        <div className="max-w-xl mx-auto space-y-8">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:scale-105">
            <span>Order on WhatsApp</span>
          </a>
          
          <p className="text-lg md:text-2xl font-sans font-semibold text-[#D4A373] tracking-[0.2em]">+91 84788 71737</p>

          {/* NEW SOCIAL LINKS SECTION */}
          <div className="flex justify-center gap-6 pt-4">
            <a 
              href="https://www.facebook.com/farmpurehoney" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#D4A373] group-hover:bg-[#D4A373] transition-all">
                <span className="text-sm">FB</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest opacity-50 group-hover:opacity-100">Facebook</span>
            </a>

            <a 
              href="https://www.instagram.com/farm.raw.honey/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#D4A373] group-hover:bg-[#D4A373] transition-all">
                <span className="text-sm">IG</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest opacity-50 group-hover:opacity-100">Instagram</span>
            </a>
          </div>

          <div className="pt-12 border-t border-white/10 opacity-80">
            <h2 className="font-serif text-2xl md:text-3xl text-[#D4A373] mb-2">Raw Honey</h2>
            <p className="text-stone-400 text-xs italic">Made with <span className="heart">♡︎</span> for honey lovers</p>
            <p className="text-[10px] tracking-[0.4em] opacity-20 uppercase font-bold pt-4">© 2026 Raw Honey Artisans</p>
          </div>
        </div>
      </footer>
    </div>
  );
}