import React, { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { ToastContainer, toast } from 'react-toastify'
import { Header } from '../components/header'
import { Mint } from '../components/mint'
import 'react-toastify/dist/ReactToastify.css'
import {
  connectWallet,
  getCurrentWalletConnected,
  getContract,
} from '../utils/interact'

const Home = () => {
  const [walletAddress, setWalletAddress] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setMintLoading] = useState(false)
  //const [presalePrice, setPresalePrice] = useState('')
  const [publicSalePrice, setPublicSalePrice] = useState('')
  const [totalSupply, setTotalSupply] = useState(0)
  const [presaleStatus, setPresaleStatus] = useState(false)
  const [publicSaleStatus, setPublicSaleStatus] = useState(false)
  const [maxMintSupply, setMaxMintSupply] = useState(0)
  const [maxPresaleMints, setMaxPresaleMints] = useState(0)

  useEffect(() => {
    async function fetchWalletInfo() {
      const { address, status } = await getCurrentWalletConnected()
      setWalletAddress(address)
      setStatus(status)
    }
    fetchWalletInfo()
  }, [])

  useEffect(() => {
    async function fetchContractInfo() {
      let contract = getContract(walletAddress)
      setPresaleStatus(await contract.isPresaleActive())
      setPublicSaleStatus(await contract.isPublicSaleActive())
      setMaxMintSupply(Number(await contract.MAX_SUPPLY()))
      setMaxPresaleMints(Number(await contract.MAX_PRESALE_MINTS()))
      setTotalSupply(BigNumber.from(await contract.totalSupply()).toNumber()) // original value * 1e5
      //setPresalePrice(BigNumber.from(await contract.PRESALE_PRICE()).toString())
      setPublicSalePrice(
        BigNumber.from(await contract.PUBLIC_PRICE()).toString(),
      )
    }
    fetchContractInfo()
  }, [loading, walletAddress])

  useEffect(() => {
    if (status) {
      notify()
      setStatus(null)
    }
    // eslint-disable-next-line
  }, [status])

  const onClickConnectWallet = async () => {
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setWalletAddress(walletResponse.address)
  }

  const onClickDisconnectWallet = async () => {
    setWalletAddress(null)
  }

  const notify = () =>
    toast.info(status, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })

  return (
    <div className="mint-page">
      <Header
        onClickDisconnectWallet={onClickDisconnectWallet}
        onClickConnectWallet={onClickConnectWallet}
        walletAddress={walletAddress}
      />
      <Mint
        loading={loading}
        walletAddress={walletAddress}
        setStatus={setStatus}
        setMintLoading={setMintLoading}
        publicSalePrice={publicSalePrice}
        presaleStatus={presaleStatus}
        publicSaleStatus={publicSaleStatus}
        totalSupply={totalSupply}
        maxMintSupply={maxMintSupply}
        maxPresaleMints={maxPresaleMints}
      />
      <ToastContainer />
    </div>
  )
}

export default Home
