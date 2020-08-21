import * as React from 'react';

export const Home = (props: any) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          width: '7%',
          float: 'left',
          backgroundColor: 'blue',
          height: '100%',
        }}
      >
        #left content in here
      </div>

      <div style={{width: '93%', float: 'right'}}>#right content in there</div>
    </div>
  );
};
