import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('Mengirim...');

    try {
      const response = await fetch('https://formspree.io/f/mjgnjjqr', {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setStatus('Terkirim!');
        form.reset();
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('Gagal Mengirim.');
      }
    } catch (error) {
      setStatus('Gagal Mengirim.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Mari Berkolaborasi</h1>
        <p className="hero-description" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Silakan tinggalkan pesan, pertanyaan, atau umpan balik. Pesan Anda akan langsung masuk ke kotak masuk email saya, dan saya akan membalasnya secepat mungkin.
        </p>
      </div>

      <div className="card" style={{ padding: '40px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px', color: 'var(--text-heading)' }}>Nama Lengkap</label>
            <input 
              type="text" 
              name="name" 
              required 
              style={{ width: '100%', padding: '14px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-main)' }} 
              placeholder="Masukkan nama Anda" 
            />
          </div>
          
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px', color: 'var(--text-heading)' }}>Alamat Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              style={{ width: '100%', padding: '14px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-main)' }} 
              placeholder="email@contoh.com" 
            />
          </div>
          
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px', color: 'var(--text-heading)' }}>Pesan</label>
            <textarea 
              name="message" 
              required 
              rows={6} 
              style={{ width: '100%', padding: '14px', borderRadius: '8px', resize: 'vertical', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-main)' }} 
              placeholder="Tuliskan pesan Anda di sini..."
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={status === 'Mengirim...'}
            style={{ marginTop: '10px', width: '100%' }}
          >
            {status === 'Mengirim...' ? 'Mengirim Pesan ⏳...' : status === 'Terkirim!' ? 'Pesan Terkirim ✅' : 'Kirim Pesan 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}