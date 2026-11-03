import { useAuth } from './auth/AuthContext'
import { AccountPage, AuthPage, ProtectedRoute } from './auth/AuthPages'
import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router'
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, Clock3, Instagram, MapPin, Menu, MoveUpRight, Phone, ShieldCheck, Sparkles, X } from 'lucide-react'
import { artists, styles } from './data'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Header() {
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => { setOpen(false) }, [location.pathname])
  return <header className="site-header">
    <div className="container header-inner">
      <Link to="/" className="brand" aria-label="INKROOM trang chủ"><span className="brand-icon">✳</span> INKROOM<span className="brand-dot">.</span></Link>
      <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Điều hướng chính">
        <NavLink to="/" end>Trang chủ</NavLink>
        <NavLink to="/about-us">Về chúng tôi</NavLink>
        <NavLink to="/artists">Nghệ sĩ</NavLink>
        <NavLink to="/gallery">Bộ sưu tập</NavLink>
        <NavLink to="/contact">Liên hệ</NavLink>
        {!loading && <NavLink to={user ? "/account" : "/login"}>{user ? "Tài khoản" : "Đăng nhập"}</NavLink>}
        <Link className="mobile-book" to="/booking">Đặt lịch xăm <ArrowUpRight size={16}/></Link>
      </nav>
      <Link className="header-book" to="/booking">Đặt lịch xăm <ArrowUpRight size={17}/></Link>
      <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Đóng menu' : 'Mở menu'} aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
    </div>
  </header>
}

function Footer() {
  return <footer className="footer">
    <div className="container footer-top">
      <div><Link to="/" className="brand footer-brand"><span className="brand-icon">✳</span> INKROOM<span className="brand-dot">.</span></Link><p>Một không gian dành cho những dấu ấn thật sự thuộc về bạn.</p></div>
      <div><h4>Khám phá</h4><Link to="/about-us">Về chúng tôi</Link><Link to="/artists">Nghệ sĩ</Link><Link to="/gallery">Bộ sưu tập</Link></div>
      <div><h4>Hỗ trợ</h4><Link to="/booking">Đặt lịch tư vấn</Link><Link to="/contact">Liên hệ</Link><a href="mailto:hello@inkroom.studio">hello@inkroom.studio</a></div>
      <div><h4>Ghé thăm studio</h4><p>Quận 1, TP. Hồ Chí Minh<br/>Thứ 2 – Chủ nhật · 10:00 – 20:00</p><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20}/></a></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} INKROOM Studio. Made with intention.</span><span>Ý tưởng · Nghệ thuật · Dấu ấn</span></div>
  </footer>
}

function Layout({ children }) { return <><ScrollToTop/><Header/><main>{children}</main><Footer/></> }

function SectionHeading({ eyebrow, title, text, link, linkText }) {
  return <div className="section-heading"><div><div className="eyebrow"><span/> {eyebrow}</div><h2>{title}</h2>{text && <p>{text}</p>}</div>{link && <Link className="text-link" to={link}>{linkText} <ArrowUpRight size={18}/></Link>}</div>
}

function TattooArtwork({ variant = 'hero' }) {
  return <div className={`tattoo-art tattoo-art-${variant}`} aria-hidden="true">
    <div className="art-halo"/><div className="art-ring art-ring-one"/><div className="art-ring art-ring-two"/>
    <svg className="art-flower" viewBox="0 0 360 430" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M180 405c-4-55 15-102 11-148M184 354c-30-38-64-51-89-49M185 325c32-27 63-30 91-18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M93 305c19-17 40-16 55-5-17 18-35 25-55 5ZM276 307c-15-20-35-25-53-18 11 20 28 31 53 18Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M180 212c-57-17-77-61-61-104 37 2 60 29 61 68 1-39 24-66 61-68 16 43-4 87-61 104Z" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M180 212c-42 19-84 10-104-24 23-30 56-36 87-17-31-22-34-57-11-86 39 14 59 56 28 127ZM180 212c42 19 84 10 104-24-23-30-56-36-87-17 31-22 34-57 11-86-39 14-59 56-28 127Z" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M180 211c-17-33-9-63 0-80 9 17 17 47 0 80ZM180 210c-28-11-45-30-50-52 25 3 44 22 50 52ZM180 210c28-11 45-30 50-52-25 3-44 22-50 52Z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="180" cy="215" r="18" stroke="currentColor" strokeWidth="2"/><circle cx="180" cy="215" r="7" fill="currentColor"/>
      <path d="m70 108-2-10-2 10-10 2 10 2 2 10 2-10 10-2-10-2ZM298 88l-2-10-2 10-10 2 10 2 2 10 2-10 10-2-10-2ZM301 243l-1-7-1 7-7 1 7 1 1 7 1-7 7-1-7-1Z" fill="currentColor"/>
      <path d="M180 245c-55-3-98-25-129-62M180 245c55-3 98-25 129-62" stroke="currentColor" strokeWidth="1" strokeDasharray="2 7"/>
    </svg>
    <span className="art-caption">ART ON SKIN · EST. 2020</span>
  </div>
}

function Home() {
  return <>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow light"><span/> TATTOO STUDIO · SAIGON</div><h1>Nghệ thuật<br/>ở lại <em>cùng bạn.</em></h1><p>Không chỉ là một hình xăm. Đó là câu chuyện của bạn, được kể bằng đường nét, cảm xúc và sự tận tâm của người nghệ sĩ.</p><div className="hero-actions"><Link className="button button-gold" to="/booking">Đặt lịch tư vấn <ArrowUpRight size={19}/></Link><Link className="hero-link" to="/gallery">Khám phá tác phẩm <ArrowDownRight size={18}/></Link></div><div className="hero-stats"><div><strong>500<span>+</span></strong><small>Tác phẩm hoàn thiện</small></div><div><strong>08<span>+</span></strong><small>Năm kinh nghiệm</small></div><div><strong>100<span>%</span></strong><small>Thiết kế cá nhân</small></div></div></div><div className="hero-visual"><TattooArtwork/><div className="visual-stamp"><span>✳</span> YOUR STORY<br/>IN INK</div></div></div><div className="hero-side-note">SCROLL TO EXPLORE <span>↓</span></div></section>
    <section className="intro-section section"><div className="container intro-grid"><div className="intro-mark">✳</div><div><div className="eyebrow"><span/> CHÀO MỪNG ĐẾN INKROOM</div><h2>Một hình xăm đẹp bắt đầu từ <em>một cuộc trò chuyện.</em></h2></div><div className="intro-description"><p>Chúng tôi tin rằng mỗi người đều có một câu chuyện đáng được lưu giữ. INKROOM là nơi ý tưởng của bạn gặp sự sáng tạo của nghệ sĩ, để cùng tạo nên một dấu ấn không thể trộn lẫn.</p><Link className="text-link" to="/about-us">Tìm hiểu về chúng tôi <ArrowUpRight size={18}/></Link></div></div></section>
    <section className="styles-section section"><div className="container"><SectionHeading eyebrow="PHONG CÁCH XĂM" title={<>Tìm chất riêng <em>của bạn.</em></>} text="Từ nét mảnh tinh tế đến mảng đậm cá tính, chúng tôi luôn có một phong cách dành cho câu chuyện của bạn." link="/gallery" linkText="Xem bộ sưu tập"/><div className="style-grid">{styles.map(style => <Link to="/gallery" className="style-card" key={style.name}><div className="style-card-top"><span>{style.number} / 04</span><ArrowUpRight size={20}/></div><div className="style-symbol">{style.symbol}</div><div><h3>{style.name}</h3><p>{style.description}</p></div></Link>)}</div></div></section>
    <section className="feature-section"><div className="container feature-grid"><div className="feature-visual"><TattooArtwork variant="feature"/><span className="feature-photo-label">THE INKROOM EXPERIENCE</span></div><div className="feature-copy"><div className="eyebrow"><span/> TRẢI NGHIỆM TẠI STUDIO</div><h2>Đẹp từ ý tưởng.<br/><em>An tâm từng nét mực.</em></h2><p>Chúng tôi dành thời gian để lắng nghe, tư vấn và thiết kế cho riêng bạn. Mọi buổi xăm đều được thực hiện trong không gian riêng tư với quy trình vệ sinh rõ ràng.</p><div className="feature-list"><div><span><Sparkles size={19}/></span><div><strong>Thiết kế riêng 1:1</strong><small>Không sao chép, không đại trà.</small></div></div><div><span><ShieldCheck size={19}/></span><div><strong>An toàn & vệ sinh</strong><small>Kim mới, dụng cụ vô trùng cho mỗi khách.</small></div></div><div><span><Clock3 size={19}/></span><div><strong>Chăm sóc sau xăm</strong><small>Hướng dẫn tận tình sau mỗi buổi hẹn.</small></div></div></div><Link className="button button-dark" to="/booking">Bắt đầu câu chuyện của bạn <ArrowUpRight size={18}/></Link></div></div></section>
    <section className="artists-section section"><div className="container"><SectionHeading eyebrow="GẶP GỠ NGHỆ SĨ" title={<>Bàn tay tạo nên <em>dấu ấn.</em></>} text="Những người nghệ sĩ luôn đặt sự lắng nghe và tâm huyết vào từng tác phẩm." link="/artists" linkText="Tất cả nghệ sĩ"/><ArtistGrid compact/></div></section>
    <CtaSection/>
  </>
}

function ArtistGrid({ compact = false }) { return <div className="artist-grid">{artists.map((artist, index) => <article className={`artist-card artist-${artist.tone}`} key={artist.id}><div className="artist-portrait"><span className="artist-monogram">{artist.initials}</span><span className="portrait-decoration">✳</span><span className="artist-number">0{index + 1}</span></div><div className="artist-info"><div><h3>{artist.name}</h3><p>{artist.role}</p></div><ArrowUpRight size={22}/></div>{!compact && <p className="artist-quote">“{artist.quote}”</p>}</article>)}</div> }

function CtaSection() { return <section className="cta-section"><div className="container cta-inner"><span className="cta-star">✳</span><div><div className="eyebrow light"><span/> BẮT ĐẦU TỪ ĐÂY</div><h2>Câu chuyện của bạn,<br/><em>chúng mình cùng vẽ.</em></h2><p>Chia sẻ ý tưởng với INKROOM và đặt một buổi tư vấn miễn phí.</p></div><Link className="button button-gold" to="/booking">Đặt lịch ngay <ArrowUpRight size={20}/></Link></div></section> }

function PageHero({ label, title, description }) { return <section className="page-hero"><div className="container"><div className="eyebrow light"><span/> {label}</div><h1>{title}</h1><p>{description}</p></div><span className="page-hero-star">✳</span></section> }

function About() { return <><PageHero label="VỀ CHÚNG TÔI" title={<>Không gian cho <em>câu chuyện của bạn.</em></>} description="INKROOM là studio xăm nghệ thuật đặt con người và câu chuyện cá nhân ở vị trí đầu tiên."/><section className="section"><div className="container about-grid"><TattooArtwork variant="about"/><div><div className="eyebrow"><span/> CÂU CHUYỆN INKROOM</div><h2>Từ một ý tưởng nhỏ, đến dấu ấn đi cùng năm tháng.</h2><p>INKROOM ra đời từ niềm tin rằng nghệ thuật xăm có thể là một cách chân thành để mỗi người thể hiện chính mình. Chúng tôi tạo nên một không gian cởi mở, nơi bạn được lắng nghe trước khi một đường nét xuất hiện trên da.</p><p>Mỗi thiết kế đều được phát triển cùng bạn, cân nhắc vị trí, kích thước và ý nghĩa. Sự chỉn chu trong tư vấn, kỹ thuật và chăm sóc là lời hứa của studio với từng vị khách.</p><Link className="button button-dark" to="/booking">Đặt lịch tư vấn <ArrowUpRight size={18}/></Link></div></div></section><section className="values-section section"><div className="container"><SectionHeading eyebrow="ĐIỀU CHÚNG TÔI TIN" title={<>Mỗi nét mực đều <em>có lý do.</em></>}/><div className="value-grid"><div><span>01</span><h3>Lắng nghe trước tiên</h3><p>Ý tưởng của bạn là điểm bắt đầu cho mọi bản thiết kế.</p></div><div><span>02</span><h3>Nghệ thuật cá nhân</h3><p>Không có hai câu chuyện giống nhau, nên không có hai hình xăm giống nhau.</p></div><div><span>03</span><h3>An tâm trải nghiệm</h3><p>Quy trình vệ sinh rõ ràng và hướng dẫn chăm sóc kỹ lưỡng.</p></div></div></div></section><CtaSection/></> }

function Artists() { return <><PageHero label="ĐỘI NGŨ NGHỆ SĨ" title={<>Người kể chuyện <em>bằng nét mực.</em></>} description="Mỗi nghệ sĩ có một phong cách riêng, cùng chung sự tôn trọng với câu chuyện của bạn."/><section className="section"><div className="container"><ArtistGrid/><div className="artist-note"><p>Chưa biết chọn nghệ sĩ nào? Hãy chia sẻ ý tưởng, chúng tôi sẽ gợi ý người phù hợp với phong cách bạn muốn.</p><Link className="button button-dark" to="/booking">Nhờ tư vấn <ArrowUpRight size={18}/></Link></div></div></section></> }

function Gallery() { const [filter, setFilter] = useState('Tất cả'); const categories = ['Tất cả', ...styles.map(x => x.name)]; const works = [
  { title: 'Lời thì thầm của hoa', category: 'Floral', shape: '✿', tone: 'sand' }, { title: 'Một chút bình yên', category: 'Fine line', shape: '☾', tone: 'olive' }, { title: 'Bản lĩnh', category: 'Blackwork', shape: '✺', tone: 'clay' }, { title: 'Giữa những vì sao', category: 'Fine line', shape: '✧', tone: 'cream' }, { title: 'Nét xưa còn mãi', category: 'Traditional', shape: '✦', tone: 'brown' }, { title: 'Mùa nở rộ', category: 'Floral', shape: '❀', tone: 'sage' },
]; return <><PageHero label="BỘ SƯU TẬP" title={<>Cảm hứng cho <em>dấu ấn tiếp theo.</em></>} description="Khám phá những phong cách tại INKROOM và tìm cảm hứng cho ý tưởng của riêng bạn."/><section className="section"><div className="container"><div className="filter-list" role="group" aria-label="Lọc tác phẩm">{categories.map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} type="button">{item}</button>)}</div><div className="gallery-grid">{works.filter(work => filter === 'Tất cả' || work.category === filter).map(work => <article className={`gallery-card gallery-${work.tone}`} key={work.title}><div className="gallery-art"><span>{work.shape}</span><small>INKROOM / ART ON SKIN</small></div><div className="gallery-info"><div><h3>{work.title}</h3><p>{work.category}</p></div><ArrowUpRight size={20}/></div></article>)}</div><p className="gallery-disclaimer">Hình minh họa phong cách. Thiết kế thực tế sẽ được phát triển riêng trong buổi tư vấn.</p></div></section><CtaSection/></> }

function Booking() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', email: user.email, style: '', artist: '', date: '', time: '', idea: '' })
  const [error, setError] = useState('')
  const change = event => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = event => {
    event.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time) { setError('Vui lòng điền họ tên, số điện thoại, ngày và giờ hẹn.'); return }
    if (!/^[0-9+().\s-]{9,15}$/.test(form.phone.trim())) { setError('Số điện thoại chưa hợp lệ.'); return }
    const bookings = JSON.parse(localStorage.getItem('inkroom-bookings') || '[]')
    const booking = { ...form, id: Date.now().toString() }
    localStorage.setItem('inkroom-bookings', JSON.stringify([booking, ...bookings]))
    navigate('/booking/success', { state: booking })
  }
  const minDate = new Date().toLocaleDateString('en-CA')
  return <><PageHero label="ĐẶT LỊCH TƯ VẤN" title={<>Bắt đầu câu chuyện <em>của bạn.</em></>} description="Điền vài thông tin để chúng tôi hiểu ý tưởng và chuẩn bị cho buổi gặp đầu tiên."/><section className="section booking-section"><div className="container booking-grid"><div className="booking-intro"><div className="eyebrow"><span/> CÁCH THỨC HOẠT ĐỘNG</div><h2>Chỉ vài bước để <em>gặp nhau.</em></h2><div className="booking-steps"><div><span>01</span><div><h3>Gửi ý tưởng</h3><p>Chọn phong cách, nghệ sĩ và thời gian bạn mong muốn.</p></div></div><div><span>02</span><div><h3>Trao đổi tại studio</h3><p>Chúng mình cùng bàn về thiết kế, vị trí và kích thước.</p></div></div><div><span>03</span><div><h3>Tạo dấu ấn</h3><p>Sau khi thống nhất phương án, hãy sẵn sàng cho buổi xăm.</p></div></div></div><div className="booking-help"><Sparkles size={22}/><p>Buổi tư vấn đầu tiên hoàn toàn miễn phí. Thông tin được lưu trên trình duyệt để bạn xem lại; đây là bản demo, studio chưa nhận lịch tự động.</p></div></div><form className="booking-form" onSubmit={submit}><div className="form-heading"><span>01 / THÔNG TIN CỦA BẠN</span><h2>Đặt lịch hẹn</h2></div><div className="form-row"><label>Họ và tên <b>*</b><input name="name" value={form.name} onChange={change} placeholder="Nguyễn Minh Anh" required/></label><label>Số điện thoại <b>*</b><input name="phone" value={form.phone} onChange={change} placeholder="090 123 4567" inputMode="tel" required/></label></div><label>Email<input type="email" name="email" value={form.email} onChange={change} placeholder="ban@example.com"/></label><div className="form-divider"/><div className="form-heading"><span>02 / Ý TƯỞNG CỦA BẠN</span></div><div className="form-row"><label>Phong cách yêu thích <span className="select-wrap"><select name="style" value={form.style} onChange={change}><option value="">Chọn phong cách</option>{styles.map(item => <option key={item.name}>{item.name}</option>)}</select><ChevronDown size={17}/></span></label><label>Nghệ sĩ mong muốn <span className="select-wrap"><select name="artist" value={form.artist} onChange={change}><option value="">Để studio gợi ý</option>{artists.map(item => <option key={item.id}>{item.name}</option>)}</select><ChevronDown size={17}/></span></label></div><div className="form-row"><label>Ngày hẹn <b>*</b><input type="date" name="date" min={minDate} value={form.date} onChange={change} required/></label><label>Khung giờ <b>*</b><span className="select-wrap"><select name="time" value={form.time} onChange={change} required><option value="">Chọn khung giờ</option><option>10:00</option><option>11:00</option><option>13:00</option><option>14:00</option><option>15:00</option><option>16:00</option><option>17:00</option><option>18:00</option></select><ChevronDown size={17}/></span></label></div><label>Chia sẻ ý tưởng của bạn<textarea name="idea" value={form.idea} onChange={change} placeholder="Bạn muốn xăm hình gì? Vị trí, kích thước hoặc ý nghĩa đặc biệt..." rows="4"/></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark submit-button" type="submit">Gửi yêu cầu đặt lịch <ArrowUpRight size={19}/></button><small className="form-note">Đây là project demo. Yêu cầu chỉ lưu trên trình duyệt của bạn và chưa được gửi đến studio.</small></form></div></section></>
}

function BookingSuccess() { const { state } = useLocation(); return <section className="success-section"><div className="container"><div className="success-card"><div className="success-icon"><Check size={36}/></div><div className="eyebrow"><span/> ĐÃ LƯU YÊU CẦU</div><h1>Cảm ơn bạn, {state?.name || 'bạn'}!</h1><p>Thông tin đặt lịch demo đã được lưu trên trình duyệt này. Studio chưa nhận được thông báo tự động.</p>{state && <div className="success-details"><span><CalendarDays size={18}/> {new Date(`${state.date}T12:00:00`).toLocaleDateString('vi-VN')}</span><span><Clock3 size={18}/> {state.time}</span><span><Phone size={18}/> {state.phone}</span></div>}<div className="success-actions"><Link className="button button-dark" to="/">Về trang chủ <ArrowRight size={18}/></Link><Link className="text-link" to="/booking">Đặt lịch khác <ArrowUpRight size={18}/></Link></div></div></div></section> }

function Contact() { return <><PageHero label="LIÊN HỆ" title={<>Ghé studio, <em>mình trò chuyện nhé.</em></>} description="Một câu hỏi nhỏ, một ý tưởng lớn hay chỉ muốn tìm hiểu thêm — chúng mình luôn sẵn sàng lắng nghe."/><section className="section"><div className="container contact-grid"><div><div className="eyebrow"><span/> TÌM ĐẾN INKROOM</div><h2>Hẹn gặp bạn<br/><em>tại studio.</em></h2><p>Hãy đặt lịch trước khi đến để nghệ sĩ có thể dành trọn thời gian tư vấn cho bạn.</p><Link className="button button-dark" to="/booking">Đặt lịch tư vấn <ArrowUpRight size={18}/></Link></div><div className="contact-cards"><div><MapPin/><span>ĐỊA CHỈ</span><strong>Quận 1, TP. Hồ Chí Minh</strong><small>Địa chỉ cụ thể sẽ được bổ sung khi studio hoạt động.</small></div><div><Clock3/><span>GIỜ MỞ CỬA</span><strong>Thứ 2 – Chủ nhật</strong><small>10:00 – 20:00</small></div><div><Phone/><span>LIÊN HỆ</span><strong>hello@inkroom.studio</strong><small>Thông tin liên hệ minh họa cho project.</small></div></div></div></section></> }

function NotFound() { return <section className="not-found"><span>✳</span><p>404 / KHÔNG TÌM THẤY TRANG</p><h1>Có vẻ bạn đã đi lạc.</h1><Link className="button button-dark" to="/">Trở về trang chủ <ArrowRight size={18}/></Link></section> }

export default function App() { return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/about-us" element={<About/>}/><Route path="/artists" element={<Artists/>}/><Route path="/gallery" element={<Gallery/>}/><Route path="/login" element={<AuthPage key="login" mode="login"/>}/><Route path="/register" element={<AuthPage key="register" mode="register"/>}/><Route path="/account" element={<ProtectedRoute><AccountPage/></ProtectedRoute>}/><Route path="/booking" element={<ProtectedRoute><Booking/></ProtectedRoute>}/><Route path="/booking/success" element={<ProtectedRoute><BookingSuccess/></ProtectedRoute>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes></Layout> }
