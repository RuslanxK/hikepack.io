import { useState , useEffect} from 'react';
import { Link } from 'react-router-dom';
import { FaWandMagicSparkles, FaUser } from "react-icons/fa6";
import { HiCheckCircle } from 'react-icons/hi'
import TryItNowSection from './TryItNowSection';

const links = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '/features' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Contact', path: '/contact' }
];

const Homepage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasShadow(true);
      } else {
        setHasShadow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const openLightbox = () => setIsOpen(true);
  const closeLightbox = () => setIsOpen(false);

  return (
    <div className='w-full bg-white'>
      <nav className={`bg-white pl-10 pr-10 pt-4 pb-4 fixed top-0 left-0 w-full z-50 ${hasShadow ? 'shadow-airbnb' : ''}`}>
        <div className='container mx-auto flex items-center justify-between'>
          <div className='flex flex-row items-center'>
          <img src='/images/logo-black.png' width={75} className='cursor-pointer mr-10' alt='logo'/>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='md:hidden text-black focus:outline-none'>{isOpen ? '✖' : '☰'}
          </button>
          <div className={`absolute md:static top-16 left-0 w-full md:w-auto md:flex md:space-x-8 bg-white md:bg-transparent p-5 md:p-0 shadow-md md:shadow-none ${isOpen ? 'block' : 'hidden'} md:block`}>
            {links.map(({ name, path }) => (
              <Link key={name} to={path} className='hover:text-orange text-sm block md:inline-block text-black py-2 md:py-0 hover:text-green-600'>{name}</Link>))}
          </div>
          </div>
          <div className='flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0'>
          <Link to='/demo' className='group text-sm flex items-center hover:text-orange text-black hover:text-green-600 py-2 md:py-0'>
          Try Demo <FaWandMagicSparkles size={18} className='group-hover:text-orange ml-2 text-gray-400'/> </Link>
          <Link to='/login' className='group text-sm flex items-center hover:text-orange text-black hover:text-green-600 py-2 md:py-0'>
           Login <FaUser size={18} className='group-hover:text-orange ml-2 mr-2 text-gray-400'/></Link>
          <button className='bg-primary text-sm text-white px-4 py-2 rounded-lg hover:bg-orange mt-2 md:mt-0 transition'>Get Started</button>
          </div>
        </div>
      </nav>
      <main className="pt-16 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/images/homepage-background.webp')"}}>
  <h1 className='text-white text-6xl font-bold text-center mt-16'>
    Elevate Your Hiking <br /> 
    <span className='text-orange'>Experience</span>
  </h1>
  <div className='mt-8 flex flex-col md:flex-row md:justify-center md:space-x-8 items-start md:items-center text-center md:text-left'>
 
    <div className='flex items-center md:items-center md:flex-row space-x-2'>
      <HiCheckCircle className='text-orange text-3xl' size={22} />
      <p className='text-md text-white opacity-80'>Discover the future of hiking</p>
    </div>
    
    <div className='flex items-center md:items-center md:flex-row space-x-2'>
      <HiCheckCircle className='text-orange text-3xl' size={22} />
      <p className='text-md text-white opacity-80'>Track your journey effortlessly</p>
    </div>
    
    <div className='flex items-center md:items-center md:flex-row space-x-2'>
      <HiCheckCircle className='text-orange text-3xl' size={22} />
      <p className='text-md text-white opacity-80'>Share your adventures globally</p>
    </div>
  </div>
  <div className='mt-12 flex flex-col md:flex-row items-center justify-center text-center md:text-left md:space-x-4'>
   
    <div className='flex'>
      <img className="w-10 h-10 rounded-full" src="/images/hiker-1.png" alt="hiker-1" />
      <img className="w-10 h-10 rounded-full -ml-3" src="/images/hiker-2.png" alt="hiker-2" />
      <img className="w-10 h-10 rounded-full -ml-3" src="/images/hiker-3.png" alt="hiker-3" />
    </div>
    <div className='mt-4 md:mt-0'>
      <p className='text-md text-white'>Join <span className='underline underline-offset-2'>5000+</span> Active Hikers</p>
    </div>

    <div className='mt-4 md:mt-0'>
      <button className='bg-white font-semibold text-black px-6 py-2 rounded-md hover:bg-orange-700 transition hover:bg-primary hover:text-white'>
        Explore Now
      </button>
    </div>
  </div>

  <div className='mt-12 sm:w-[1050px] flex justify-center m-auto'>
      {/* Video Placeholder */}
      <div 
        className='relative w-full h-[250px] md:h-[300px] lg:h-[500px] rounded-t-lg overflow-hidden cursor-pointer'
        onClick={openLightbox}
      >
        {/* Placeholder Image */}
        <img
          src='/images/placeholder-video.png'
          alt='Video Placeholder'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 flex items-center justify-center bg-opacity-50'>
          <div className='bg-white p-4 rounded-full shadow-lg'>
            <svg
              className='w-12 h-12 text-orange'
              fill='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M8 5v14l11-7z' />
            </svg>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50' onClick={() => setIsOpen(false)}>
          <div className='relative w-full max-w-4xl p-4'>
            <button
              className='absolute top-4 right-4 text-white text-3xl'
              onClick={closeLightbox}
            >
              &times;
            </button>
            <iframe
              className='w-full h-[300px] md:h-[500px] rounded-lg'
              src='https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
              title='Video Placeholder'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
</main>

<section className='bg-white flex flex-col justify-center items-center pt-12 pb-12'>
  <h2 className='text-4xl font-bold text-center pb-12'>
    Discover the <span className='text-primary'>Future of Hiking</span>
  </h2>
  <div className='sm:grid sm:grid-cols-2 sm:gap-8'>
    <div className='w-96 h-96 flex justify-center items-center overflow-hidden bg-gray-100 rounded-lg mt-5 sm:mt-0'>
      <img
        src='/images/weight-analysis.png'
        alt='weight analysis'
        className='w-full h-full object-contain animate-zigzag delay-[0ms]'
      />
    </div>
    <div className='w-96 h-96 flex justify-center items-center overflow-hidden bg-gray-100 rounded-lg mt-5 sm:mt-0'>
      <img
        src='/images/custom-order.png'
        alt='custom order'
        className='w-full h-full object-contain animate-zigzag delay-[200ms]'
      />
    </div>
    <div className='w-96 h-96 flex justify-center items-center overflow-hidden bg-gray-100 rounded-lg mt-5 sm:mt-0'>
      <img
        src='/images/navigation.png'
        alt='navigation'
        className='w-full h-full object-contain animate-zigzag delay-[400ms]'
      />
    </div>
    <div className='w-96 h-96 flex justify-center items-center overflow-hidden bg-gray-100 rounded-lg mt-5 sm:mt-0'>
      <img
        src='/images/community.png'
        alt='community'
        className='w-full h-full object-contain animate-zigzag delay-[600ms]'
      />
    </div>
  </div>
</section>



<section className="p-16 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/images/homepage-background.webp')"}}>

  <h1 className='text-white text-6xl font-bold text-center'>
    Elevate Your Hiking <br /> 
    <span className='text-orange'>Experience</span>
  </h1>
  <div className='mt-8 flex flex-col md:flex-row md:justify-center md:space-x-8 items-start md:items-center text-center md:text-left'>
 
    <div className='flex items-center md:items-center md:flex-row space-x-2'>
      <HiCheckCircle className='text-orange text-3xl' size={22} />
      <p className='text-md text-white opacity-80'>Discover the future of hiking</p>
    </div>
    
    <div className='flex items-center md:items-center md:flex-row space-x-2'>
      <HiCheckCircle className='text-orange text-3xl' size={22} />
      <p className='text-md text-white opacity-80'>Track your journey effortlessly</p>
    </div>
    
    <div className='flex items-center md:items-center md:flex-row space-x-2'>
      <HiCheckCircle className='text-orange text-3xl' size={22} />
      <p className='text-md text-white opacity-80'>Share your adventures globally</p>
    </div>
  </div>
  <div className='mt-12 flex flex-col md:flex-row items-center justify-center text-center md:text-left md:space-x-4'>
   
    <div className='flex'>
      <img className="w-10 h-10 rounded-full border border-2 border-white" src="/images/hiker-1.png" alt="hiker-1" />
      <img className="w-10 h-10 rounded-full border border-2 border-white -ml-3" src="/images/hiker-2.png" alt="hiker-2" />
      <img className="w-10 h-10 rounded-full border border-2 border-white -ml-3" src="/images/hiker-3.png" alt="hiker-3" />
    </div>
    <div className='mt-4 md:mt-0'>
      <p className='text-md text-white'>Join <span className='underline underline-offset-2'>5000+</span> Active Hikers</p>
    </div>

    <div className='mt-4 md:mt-0'>
      <button className='bg-white font-semibold text-black px-6 py-2 rounded-md hover:bg-orange-700 transition hover:bg-primary hover:text-white'>
        Explore Now
      </button>
    </div>
  </div>
</section>


<section className='flex-col justify-center items-center w-full pt-12 pb-12 bg-theme-bgGray'>
<TryItNowSection />
</section>

<footer className='container mx-auto flex flex-col md:flex-row items-start justify-between p-10'>
  <div className='p-4'>
    <img 
      src='/images/logo-black.png' 
      width={75} 
      className='cursor-pointer mb-4' 
      alt='logo'
    />
    <p className='text-sm text-gray-600'>
      &copy; {new Date().getFullYear()} Hikepack.io. All rights reserved.
    </p>
  </div>

  <div className='flex w-1/3 justify-between'>
  <div className='p-4'>
    <h4 className='text-md font-semibold mb-2'>Menu</h4>
    <ul className='space-y-2 text-gray-600'>
      <li><Link to='/' className='hover:text-orange transition text-sm'>Home</Link></li>
      <li><Link to='/products' className='hover:text-orange transition text-sm'>Products</Link></li>
      <li><Link to='/services' className='hover:text-orange transition text-sm'>Services</Link></li>
      <li><Link to='/contact' className='hover:text-orange transition text-sm'>Contact</Link></li>
    </ul>
  </div>

  {/* Company Section */}
  <div className='p-4'>
    <h4 className='text-md font-semibold mb-2'>Company</h4>
    <ul className='space-y-2 text-gray-600'>
      <li><Link to='/about' className='hover:text-orange transition text-sm'>About Us</Link></li>
      <li><Link to='/help-center' className='hover:text-orange transition text-sm'>Help Center</Link></li>
      <li><Link to='/privacy-policy' className='hover:text-orange transition text-sm'>Privacy Policy</Link></li>
    </ul>
  </div>

  <div className='p-4'>
  <h4 className='text-md font-semibold mb-2'>Follow Us</h4>
  <div className='flex flex-col space-y-2'>
    <a 
      href='https://facebook.com' 
      target='_blank' 
      rel='noopener noreferrer' 
      className='hover:text-orange transition font-normal text-gray-600 text-sm'
    >
      Facebook
    </a>
    <a 
      href='https://twitter.com' 
      target='_blank' 
      rel='noopener noreferrer' 
      className='hover:text-orange transition font-normal text-gray-600 text-sm'
    >
      Twitter
    </a>
    <a 
      href='https://instagram.com' 
      target='_blank' 
      rel='noopener noreferrer' 
      className='hover:text-orange transition font-normal text-gray-600 text-sm'
    >
      Instagram
    </a>

  </div>
  </div>
</div>
</footer>


</div>
  );
};

export default Homepage;
