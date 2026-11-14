import EmptyState from '../components/EmptyState';

export default function NotFound() {
  return (
    <div className="page container not-found">
      <p className="eyebrow">404</p>
      <h1>这一帧不存在</h1>
      <p className="page-head__desc">你访问的页面可能已被移动，或者从未被拍摄过。</p>
      <EmptyState
        title="回到首页继续发现"
        description="CINÉ 收录了 65 部值得一看的电影，从那里重新开始。"
        actionLabel="返回首页"
        to="/"
      />
    </div>
  );
}
