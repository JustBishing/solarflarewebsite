import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  fadeInUp,
  resolveVariant,
  useShouldReduceMotion,
} from '../lib/motion.js';
import { resolveSiteAssetUrl } from '../lib/assets.js';

const MotionArticle = motion.article;

/**
 * Portrait-led card: the name and role sit over the image rather than in a
 * footer, so the photo gets the full tile and the grid reads as faces
 * first. The bio slides up on hover and is always present for keyboard and
 * screen-reader users.
 */
const TeamCard = ({ member }) => {
  const shouldReduceMotion = useShouldReduceMotion();

  return (
    <MotionArticle
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-sf-surface/60 transition-colors duration-300 focus-within:border-sf-orange-2/60 hover:border-sf-orange-2/45"
      variants={resolveVariant(fadeInUp, shouldReduceMotion)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-sf-orange-1/10">
        <img
          src={resolveSiteAssetUrl(member.photo)}
          alt={`${member.name} portrait`}
          className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sf-bg via-sf-bg/55 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sf-orange-1/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="label-mono text-sf-orange-2">{member.role}</p>
        <h3 className="heading-display mt-2 text-xl font-bold leading-tight text-sf-text sm:text-2xl">
          {member.name}
        </h3>
        <p className="team-bio mt-3 max-h-0 overflow-hidden text-sm leading-relaxed text-sf-muted/85 opacity-0 transition-all duration-500 ease-out group-hover:max-h-48 group-hover:opacity-100 group-focus-within:max-h-48 group-focus-within:opacity-100 motion-reduce:max-h-48 motion-reduce:opacity-100">
          {member.bio}
        </p>
      </div>
    </MotionArticle>
  );
};

TeamCard.propTypes = {
  member: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
  }).isRequired,
};

export default TeamCard;
