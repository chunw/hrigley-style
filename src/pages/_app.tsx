import type { AppProps } from 'next/app'
import Script from 'next/script'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* 全局 Google 标签 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-5NZX9FBVBS"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-5NZX9FBVBS');
        `}
      </Script>
      
      <Component {...pageProps} />
    </>
  )
}

export default MyApp