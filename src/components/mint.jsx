import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
//import { MerkleTree } from 'merkletreejs'
//import keccak256 from 'keccak256'
import { getContract } from '../utils/interact'
//import { whiteList } from '../constants/whitelist'

export const Mint = (props) => {
  const {
    loading,
    walletAddress,
    setStatus,
    setMintLoading,
    publicSalePrice,
    presaleStatus,
    publicSaleStatus,
    totalSupply,
    maxMintSupply,
    maxPresaleMints,
  } = props
  const [amount, setAmount] = useState(1)

  useEffect(() => {
    if (presaleStatus) {
      setAmount(3)
    } else {
      setAmount(0)
    }
  }, [presaleStatus, publicSaleStatus])


  const increaseAmount = () => {
    if (presaleStatus) {
      if (amount < maxPresaleMints) setAmount(amount + 1)
    }
    if (publicSaleStatus) {
      if (amount < 50) setAmount(amount + 1)
    }
    if (!presaleStatus && !publicSaleStatus) {
      setAmount(0)
    }
  }

  const decreaseAmount = () => {
    if (amount > 1) setAmount(amount - 1)
  }

  const handleMint = async () => {
    // let curTime = new Date().getTime()

    if (!walletAddress) {
      setStatus('Please connect your wallet!')
      return
    }

    const contract = getContract(walletAddress);
    setMintLoading(true);

    let cn = await contract.balanceOf(walletAddress);
    let nmint = parseInt(cn._hex, 16);
    console.log("walletaddress",walletAddress);
    console.log("mintNum", nmint);

    try {
      console.log("public sale price");
      let tx = await contract.mint(amount, {
        value: BigNumber.from(publicSalePrice).mul(amount),
      })
      let res = await tx.wait()
      console.log('mint res', res)
      if (res.transactionHash) {
        setStatus(`You minted ${amount} SON Successfully`)
        setMintLoading(false)
      }
    } catch (err) {
      console.log('mint error', err)
      let errorContainer =
        err.error && err.error.message ? err.error.message : ''
      let errorBody = errorContainer.substr(errorContainer.indexOf(':') + 1)
      let status =
        'Transaction failed because you have insufficient funds or sales not started'
      errorContainer.indexOf('execution reverted') === -1
        ? setStatus(status)
        : setStatus(errorBody)
      setMintLoading(false)
    }
  }

  return (
    <div className="mint-page-panel">
      <img className="left-bar" src="img/mint-monkey.gif" alt="Header" />
      <h3>Amount to mint</h3>
      <h2 style={{ margin: '0' }}>
        {totalSupply} / {maxMintSupply}{' '}
      </h2>

      <div className="btn-group">
        <button className="left" onClick={decreaseAmount}>
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0002 13.5303L5.65355 9.18367C5.14022 8.67034 5.14022 7.83034 5.65355 7.317L10.0002 2.97034"
              stroke="#E5E5E5"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div>{amount}</div>
        <button className="right" onClick={increaseAmount}>
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.99978 13.5303L10.3464 9.18367C10.8598 8.67034 10.8598 7.83034 10.3464 7.317L5.99978 2.97034"
              stroke="#E5E5E5"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {loading ? (
        <button className="mint-btn" disabled={false}>
          {' '}
          MINTING{' '}
        </button>
      ) : (
        <button className="mint-btn" onClick={handleMint} disabled={false}>
          {' '}
          MINT{' '}
        </button>
      )}
    </div>
  )
}
