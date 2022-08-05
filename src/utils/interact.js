import { ethers } from "ethers";
import { contractAddress } from "../constants/address";
import { chainId } from "../constants/address";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const chain = await window.ethereum.request({ method: "eth_chainId" });
      if (parseInt(chain, 16) === parseInt(chainId, 16)) {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "",
          };
        } else {
          return {
            address: "",
            status: "Connect your wallet account to the site.",
          };
        }
      } else {
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainId }],
        });
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "",
          };
        } else {
          return {
            address: "",
            status: "Connect your wallet account to the site.",
          };
        }
      }
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status:
        "You must install Metamask, a virtual Ethereum wallet, in your browser.",
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      const chain = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (addressArray.length > 0 && chain === chainId) {
        return {
          address: addressArray[0],
          status: "",
        };
      } else {
        return {
          address: "",
          status:
            "Connect to Metamask and choose the correct chain using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status:
        "You must install Metamask, a virtual Ethereum wallet, in your browser.",
    };
  }
};

export const getContract = (walletAddress) => {
  const contractABI = require("../constants/contract.json");
  let contract;

  try {
    if (
      walletAddress === null ||
      walletAddress === "" ||
      walletAddress === undefined
    ) {
      if (parseInt(chainId, 16) === 4)
        contract = new ethers.Contract(
          contractAddress,
          contractABI,
          ethers.getDefaultProvider("rinkeby")
        );
      if (parseInt(chainId, 16) === 1)
        contract = new ethers.Contract(
          contractAddress,
          contractABI,
          ethers.getDefaultProvider("mainnet")
        );
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractABI, signer);
    }
  } catch (error) {
    contract = null;
  }
  return contract;
};
