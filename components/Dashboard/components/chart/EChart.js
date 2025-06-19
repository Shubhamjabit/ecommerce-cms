import {Row, Col, Typography} from 'antd';
import eChart from './configs/eChart';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});
function EChart({styles}) {
  const {Title, Paragraph} = Typography;

  const items = [
    {
      Title: '3.6K',
      user: 'Users',
    },
    {
      Title: '2m',
      user: 'Clicks',
    },
    {
      Title: '$772',
      user: 'Sales',
    },
    {
      Title: '82',
      user: 'Items',
    },
  ];

  return (
    <>
      <div id="chart">
        <ReactApexChart
          className={styles.barchart}
          options={eChart.options}
          series={eChart.series}
          type="bar"
          height={220}
        />
      </div>
      <div className={styles.chartvistior}>
        <Title level={5}>Active Users</Title>
        <Paragraph className={styles.lastweek}>
          than last week <span className={styles.bnb2}>+30%</span>
        </Paragraph>
        <Paragraph className={styles.lastweek}>
          We have created multiple options for you to put together and customise
          into pixel perfect pages.
        </Paragraph>
        <Row gutter>
          {items.map((v, index) => (
            <Col xs={6} xl={6} sm={6} md={6} key={index}>
              <div className={styles.chartvisitorcount}>
                <Title level={4}>{v.Title}</Title>
                <span>{v.user}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default EChart;
