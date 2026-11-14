import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';
import { TOPICS } from '../data/topics';
import { IconArrowRight } from './Icons';

const TOPIC_LINKS = {
  'sci-fi': '/discover?genre=科幻',
  mystery: '/discover?genre=悬疑',
  romance: '/discover?genre=爱情',
  classic: '/discover?collection=classic',
  healing: '/discover?collection=healing',
  action: '/discover?genre=动作',
};

/** 精选专题：6 个主题入口，各自使用独立剧照作为背景 */
export default function GenreSection({ movies = [] }) {
  return (
    <div className="topic-grid">
      {TOPICS.map((topic) => {
        const count = movies.filter(topic.filter).length;
        return (
          <Link className="topic-card" to={TOPIC_LINKS[topic.key] || '/discover'} key={topic.key}>
            <SmartImage className="topic-card__media" src={topic.backdrop} alt="" fallbackText={topic.title} />
            <span className="topic-card__scrim" aria-hidden="true" />
            <span className="topic-card__content">
              <span className="topic-card__en">{topic.en}</span>
              <span className="topic-card__title">{topic.title}</span>
              <span className="topic-card__desc">{topic.desc}</span>
              <span className="topic-card__foot">
                {count} 部影片
                <IconArrowRight />
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
