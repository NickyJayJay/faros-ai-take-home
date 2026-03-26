import jiraIcon from '@/assets/jira.png';
import githubIcon from '@/assets/github.png';
import pagerdutyIcon from '@/assets/pagerduty.png';
import calendarIcon from '@/assets/google-calendar.png';

interface AccountIconProps {
  type: string;
  source: string;
}

const ICON_MAP: Record<string, { src: string; alt: string }> = {
  tms: { src: jiraIcon, alt: 'Jira' },
  vcs: { src: githubIcon, alt: 'GitHub' },
  ims: { src: pagerdutyIcon, alt: 'PagerDuty' },
  cal: { src: calendarIcon, alt: 'Google Calendar' },
};

export function AccountIcon({ type, source }: AccountIconProps) {
  const icon = ICON_MAP[type];

  if (!icon) {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[10px] font-medium text-muted-foreground"
        title={source}
      >
        {source.charAt(0)}
      </span>
    );
  }

  return <img src={icon.src} alt={icon.alt} title={source} className="h-5 w-5 object-contain" />;
}
