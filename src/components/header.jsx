
export const Header = (props) => {
  // const navigate = useNavigate();
  const { onClickConnectWallet, onClickDisconnectWallet, walletAddress } = props

  return (
    <header>
      <div className="logo-header">
        <img className="left-bar" src="img/header-right.png" alt="Header" />
        <img className="logo" src="img/logo.png" alt="Header" />
        <img className="right-bar" src="img/header-left.png" alt="Header" />
      </div>
      <div className="connect-wallet">
      {
        walletAddress ? 
        <button className="mint-btn" onClick={onClickDisconnectWallet}>
          { walletAddress.slice(0, 11) }...
        </button>
        :
        <button className="mint-btn" onClick={onClickConnectWallet}>
          Connect
        </button>
      }
      </div>


    </header>
  );
};

