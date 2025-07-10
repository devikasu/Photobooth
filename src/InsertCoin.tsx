import React from 'react';

interface InsertCoinProps {
  onInsertCoin: () => void;
  coinInserted: boolean;
}

const InsertCoin: React.FC<InsertCoinProps> = ({ onInsertCoin, coinInserted }) => (
  <>
    <div className="insert-coin-title">Insert the coin here</div>
    <img
      src="/Page_2___Pixel_Coin_Vector_Art__Icons__and_Graphics_for_Free_Download-removebg-preview.png"
      alt="Coin"
      className={`coin-image${coinInserted ? ' coin-inserting' : ''}`}
    />
    <div className="coin-inserter">
      <div className="coin-slot"></div>
      <div className="coin-label" onClick={onInsertCoin}>Insert Coin</div>
    </div>
  </>
);

export default InsertCoin; 