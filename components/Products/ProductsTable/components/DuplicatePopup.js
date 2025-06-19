import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Radio, Modal, Select, Row, Col} from 'antd';
import {CopyOutlined} from '@ant-design/icons';
import Router from 'next/router';
import styles from '../components/styles.module.scss';
import {useSelector} from 'react-redux';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import axios from 'axios';
const DuplicatePopup = ({
  visible,
  handleOk,
  handleCancel,
  DuplicateBannerflag,
}) => {
  const product = useSelector((status) => status.productReducer.product);
  console.log('ppppppppppppppppppp', product);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [productDetailById, setProductDetailById] = useState(null);
  console.log('ppppppppppppppppppp2222222222', productDetailById);

  // set product details by id whenever id changes
  useEffect(() => {
    if (product?.id) {
      getProductDetail();
    }
  }, [product && product.id]);

  const getProductDetail = async (productID) => {
    {
      const variables = {
        product_id: product?.id,
      };
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getProductDetailByID}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('!!getProductDetailbyId', data.data);
        setProductDetailById(data.data.data.productDetail.data[0]);
      } catch (error) {
        console.log('error getProductDetail in DuplicatePopup:', error.message);
      }
    }
  };

  // duplicate only after confirm yes
  const duplicate_product = async () => {
    setSubmitLoading(true);
    try {
      const variables = {
        productDetailById: productDetailById,
      };

      const data = await axios
        .post(`${envUrl.baseUrl}${cmsendPoint.duplicateProduct}`, variables, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(function (result) {
          if (result) {
            if (result.data.duplicateProductStatus === 'success') {
              setSubmitLoading(false);
              DuplicateBannerflag();
              handleCancel();
            } else {
              //not deleted
            }
          } else {
            //error
          }
        })
        .catch(function (error) {
          console.log('@@@@@@@@@@@@@@@result-1', error);
        });
    } catch (error) {
      console.log('error signIn:', error.message);
      setSubmitLoading(false);
    }
  };
  return (
    <>
      <Modal
        title={null}
        visible={visible}
        onOk={handleOk}
        centered={true}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={386}
      >
        <Row>
          <Col span={1} offset={11}>
            <CopyOutlined className={styles.deletePopupBoxIcon} />
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={4}>
            <dev className={styles.textArea}>
              <p className={styles.deleteText1}>Duplicate the product</p>
              <p className={styles.text2}>Are you sure?</p>
            </dev>
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={3}>
            <Button
              className={styles.yesButton}
              onClick={duplicate_product}
              loading={submitLoading}
            >
              Yes
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={3}>
            <Button className={styles.noButton} onClick={handleCancel}>
              No
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default DuplicatePopup;
