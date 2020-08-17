import React, { useState } from 'react';
import { TimeSplit } from './typings/global';
import { tick } from './utils/time';
import { useCssHandles } from 'vtex.css-handles';
import { useQuery } from 'react-apollo';
// @ts-ignore
import useProduct from 'vtex.product-context/useProduct';
import productReleaseDate from './queries/productReleaseDate.graphql';

interface CountdownProps { 
  targetDate: string
}

const CSS_HANDLES = ['countdown'];
const DEFAULT_TARGET_DATE = (new Date('2020-06-25')).toISOString()

const Countdown: StorefrontFunctionComponent<CountdownProps> = () => {
  const productContext = useProduct()
  const product = productContext?.product
  const linkText = product?.linkText
  
  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
    slug: linkText
    },
    ssr: false,
    skip: !linkText
  });  

  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })
  
  const handles = useCssHandles(CSS_HANDLES);

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime);

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Erro!</span>
      </div>
    )
  }

  return (
    <div className={`${handles.countdown} db tc`}>
      {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: {
        title: 'editor.countdown.title.title',
        type: 'string',
        default: null,
      },
      description: 'Data final utilizada no contador',
      type: 'string',
      default: null,
    },
  },
}

export default Countdown
