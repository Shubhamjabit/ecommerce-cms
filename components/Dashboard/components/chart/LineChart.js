//import ReactApexChart from 'react-apexcharts';
import {Typography} from 'antd';
import {MinusOutlined} from '@ant-design/icons';
import lineChart from './configs/lineChart';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});
function LineChart({styles}) {
  const {Title, Paragraph} = Typography;

  return (
    <>
      <div className={styles.linechart}>
        <div>
          <Title level={5}>Active Users</Title>
          <Paragraph className={styles.lastweek}>
            than last week <span className={styles.bnb2}>+30%</span>
          </Paragraph>
        </div>
        <div className={styles.sales}>
          <ul>
            <li>{<MinusOutlined />} Traffic</li>
            <li>{<MinusOutlined />} Sales</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={350}
        width={'100%'}
      />
    </>
  );
}

export default LineChart;
