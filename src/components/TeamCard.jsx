import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  fadeInUp,
  hoverLift,
  resolveVariant,
  useShouldReduceMotion,
} from '../lib/motion.js';
import { resolveSiteAssetUrl } from '../lib/assets.js';

const MotionArticle = motion.article;

const TeamCard = ({ member }) => {
  const shouldReduceMotion = useShouldReduceMotion();
  const hoverProps = shouldReduceMotion ? {} : { whileHover: hoverLift };

  return (
    <MotionArticle
      className="glass-card group flex h-full flex-col overflow-hidden"
      variants={resolveVariant(fadeInUp, shouldReduceMotion)}
      {...hoverProps}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-sf-orange-1/10">
        <img
          src={resolveSiteAssetUrl(member.photo)}
          alt={`${member.name} portrait`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sf-bg/80 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="heading-display text-xl font-semibold text-sf-text">{member.name}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22rem] text-sf-orange-2">
          {member.role}
        </p>
        <p className="mt-4 text-base leading-relaxed text-sf-muted">
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
