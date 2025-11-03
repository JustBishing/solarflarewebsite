import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  fadeInUp,
  hoverLift,
  resolveVariant,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionArticle = motion.article;

const TeamCard = ({ member }) => {
  const shouldReduceMotion = useShouldReduceMotion();
  const hoverProps = shouldReduceMotion ? {} : { whileHover: hoverLift };

  return (
    <MotionArticle
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_24px_36px_-35px_rgba(0,0,0,0.55)]"
      variants={resolveVariant(fadeInUp, shouldReduceMotion)}
      {...hoverProps}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-sf-orange-1/10">
        <img
          src={member.photo}
          alt={`${member.name} portrait`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-sf-black">{member.name}</h3>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18rem] text-sf-orange-1">
          {member.role}
        </p>
        <p className="mt-4 text-base leading-relaxed text-sf-black/75">
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
