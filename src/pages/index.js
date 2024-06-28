import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { Redirect } from '@docusaurus/router';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={`Hello from ${siteConfig.title}`}>
      <Redirect to={'/docs/intro'} />
    </Layout>
  );
}
