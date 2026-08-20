import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection.jsx';
import { fadeIn, resolveVariant, useShouldReduceMotion } from '../lib/motion.js';
import { resolveSiteAssetUrl } from '../lib/assets.js';

const MotionFigure = motion.figure;

/**
 * Full-bleed photograph with a caption.
 *
 * The site had no photography at all — seven sponsor logos and six portraits —
 * so a competition shot does more work here than any amount of type. It sits
 * outside the container on purpose: edge to edge reads as evidence, while the
 * same image boxed inside the grid reads as decoration.
 *
 * Renders nothing without a src, so the section disappears cleanly if an
 * editor blanks the field rather than leaving a broken frame behind.
 */
const ImageBand = ({ src, alt, caption, priority = false }) => {
  const shouldReduceMotion = useShouldReduceMotion();
  const resolved = resolveSiteAssetUrl(src);

  if (!resolved) return null;

  return (
    <AnimatedSection>
      <MotionFigure
        className="relative m-0"
        variants={resolveVariant(fadeIn, shouldReduceMotion)}
      >
        <div className="relative overflow-hidden border-y border-white/10 bg-black">
          <img
            src={resolved}
            alt={alt}
            width="2000"
            height="1125"
            className="h-[42vh] w-full object-cover sm:h-auto sm:max-h-[68vh]"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
          />
          {/* Ties the photo into the page above and below it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(12,12,16,0.55)_0%,transparent_28%,transparent_72%,rgba(12,12,16,0.75)_100%)]"
          />
        </div>
        {caption ? (
          <figcaption className="container mt-4 flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-sf-orange-1/80"
            />
            <span className="label-mono leading-[1.7] text-sf-muted/85">
              {caption}
            </span>
          </figcaption>
        ) : null}
      </MotionFigure>
    </AnimatedSection>
  );
};

ImageBand.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  caption: PropTypes.string,
  /** Set on the first band on a page so it is not lazy-loaded below the fold. */
  priority: PropTypes.bool,
};

export default ImageBand;
