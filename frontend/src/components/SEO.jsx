import { useEffect } from 'react';

/**
 * SEO Component - Dynamically updates page meta tags
 *
 * Usage:
 * <SEO
 *   title="Page Title"
 *   description="Page description"
 *   image="/path/to/image.jpg"
 *   url="https://askjury.com/page"
 * />
 */
export default function SEO({
  title,
  description,
  image = '/og-image.png',
  url = 'https://askjury.com',
  type = 'website'
}) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${title} | AskJury - The Internet's Courtroom`;
    }

    // Update or create meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      if (!content) return;

      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update meta description
    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description, 'property');
      updateMetaTag('twitter:description', description, 'property');
    }

    // Update title tags
    if (title) {
      updateMetaTag('og:title', `${title} | AskJury`, 'property');
      updateMetaTag('twitter:title', `${title} | AskJury`, 'property');
    }

    // Update image tags
    const fullImage = image.startsWith('http') ? image : `https://askjury.com${image}`;
    updateMetaTag('og:image', fullImage, 'property');
    updateMetaTag('twitter:image', fullImage, 'property');

    // Update URL
    const fullUrl = url.startsWith('http') ? url : `https://askjury.com${url}`;
    updateMetaTag('og:url', fullUrl, 'property');
    updateMetaTag('twitter:url', fullUrl, 'property');

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', fullUrl);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', fullUrl);
      document.head.appendChild(canonical);
    }

    // Update type
    updateMetaTag('og:type', type, 'property');

  }, [title, description, image, url, type]);

  return null; // This component doesn't render anything
}

/**
 * Pre-configured SEO for common pages
 */
export const HomePageSEO = () => (
  <SEO
    title="Home"
    description="Share your side. Let strangers judge. Get the verdict. Join 50K+ judges deciding 1M+ cases 24/7."
    url="https://askjury.com"
  />
);

export const CaseDetailSEO = ({ caseData }) => (
  <SEO
    title={caseData?.title || 'Case Detail'}
    description={caseData?.description?.substring(0, 155) || 'View this case and cast your verdict'}
    url={`https://askjury.com/cases/${caseData?.id}`}
    image={caseData?.image || '/og-image.png'}
    type="article"
  />
);

export const SubmitCaseSEO = () => (
  <SEO
    title="Submit Your Case"
    description="Share your dispute with the community and let the jury decide who's right"
    url="https://askjury.com/submit"
  />
);

export const LoginSEO = () => (
  <SEO
    title="Login"
    description="Login to AskJury to submit cases, vote on disputes, and join the community"
    url="https://askjury.com/login"
  />
);

export const SignupSEO = () => (
  <SEO
    title="Join the Jury"
    description="Create your account and become a judge. Help decide disputes and earn your reputation"
    url="https://askjury.com/signup"
  />
);
