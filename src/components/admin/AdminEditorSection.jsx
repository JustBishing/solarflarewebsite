import PropTypes from 'prop-types';

const AdminEditorSection = ({ children, description, title }) => (
  <section className="rounded-[2rem] border border-sf-border bg-sf-surface/80 p-6 shadow-[0_28px_48px_-30px_rgba(0,0,0,0.65)] backdrop-blur-sm sm:p-8">
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3rem] text-sf-orange-1/80">
        Live editor
      </p>
      <h2 className="mt-4 text-3xl font-bold text-sf-text sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base text-sf-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
    <div className="mt-8 space-y-6">{children}</div>
  </section>
);

AdminEditorSection.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default AdminEditorSection;
