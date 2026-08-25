import React, { useState } from 'react';
import { Web3WalletState, InrTransaction } from '../types';
import { IndianRupee, ArrowLeftRight, CheckCircle2, ShieldAlert, CreditCard, Building, QrCode, Download, RefreshCw, Sparkles, TrendingUp, History } from 'lucide-react';

interface InrExchangeHubProps {
  wallet: Web3WalletState;
  setWallet: React.Dispatch<React.SetStateAction<Web3WalletState>>;
  onAddTerminalMessage: (msg: string) => void;
}

export const InrExchangeHub: React.FC<InrExchangeHubProps> = ({
  wallet,
  setWallet,
  onAddTerminalMessage,
}) => {
  // Live Exchange Rates
  const ETH_INR_RATE = 285450;
  const PQC_INR_RATE = 85.50;

  const [activeTab, setActiveTab] = useState<'BUY' | 'SELL' | 'HISTORY'>('BUY');
  const [selectedCrypto, setSelectedCrypto] = useState<'ETH' | '$PQC'>('ETH');
  const [paymentMethod, setPaymentMethod] = useState<'UPI_GPAY' | 'UPI_PHONEPE' | 'UPI_PAYTM' | 'NETBANKING' | 'DEBIT_CARD'>('UPI_GPAY');
  
  const [inrAmountInput, setInrAmountInput] = useState<string>('10000');
  const [cryptoAmountInput, setCryptoAmountInput] = useState<string>('0.035');

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<InrTransaction | null>(null);

  // Transaction History State
  const [transactions, setTransactions] = useState<InrTransaction[]>([
    {
      id: 'tx-101',
      type: 'BUY_CRYPTO',
      paymentMethod: 'UPI_GPAY',
      cryptoAmount: 0.035,
      cryptoSymbol: 'ETH',
      inrAmount: 10000,
      exchangeRate: ETH_INR_RATE,
      status: 'SUCCESS',
      utrNumber: 'UPI/421890123/8892',
      txHash: '0x8f21a90...33c9',
      timestamp: '2026-08-12 11:45:10',
    },
    {
      id: 'tx-102',
      type: 'BUY_CRYPTO',
      paymentMethod: 'UPI_PAYTM',
      cryptoAmount: 500,
      cryptoSymbol: '$PQC',
      inrAmount: 42750,
      exchangeRate: PQC_INR_RATE,
      status: 'SUCCESS',
      utrNumber: 'UPI/991200381/1209',
      txHash: '0x11b98cc...88a1',
      timestamp: '2026-08-12 12:30:22',
    },
  ]);

  // Handle INR Amount Change
  const handleInrChange = (val: string) => {
    setInrAmountInput(val);
    const num = parseFloat(val) || 0;
    if (selectedCrypto === 'ETH') {
      setCryptoAmountInput((num / ETH_INR_RATE).toFixed(4));
    } else {
      setCryptoAmountInput((num / PQC_INR_RATE).toFixed(1));
    }
  };

  // Handle Crypto Amount Change
  const handleCryptoChange = (val: string) => {
    setCryptoAmountInput(val);
    const num = parseFloat(val) || 0;
    if (selectedCrypto === 'ETH') {
      setInrAmountInput((num * ETH_INR_RATE).toFixed(2));
    } else {
      setInrAmountInput((num * PQC_INR_RATE).toFixed(2));
    }
  };

  // Execute Buy / Sell Transaction
  const handleExecuteSwap = () => {
    if (!wallet.isConnected) {
      alert('Please connect your Web3 Wallet first!');
      return;
    }

    const inrVal = parseFloat(inrAmountInput) || 0;
    const cryptoVal = parseFloat(cryptoAmountInput) || 0;

    if (inrVal <= 0 || cryptoVal <= 0) {
      alert('Please enter a valid non-zero transaction amount.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const utr = `UTR/IN/${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      const txHash = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      if (activeTab === 'BUY') {
        // Buying Crypto with INR
        setWallet((prev) => ({
          ...prev,
          inrBalance: Math.max(0, prev.inrBalance - inrVal),
          ethBalance: selectedCrypto === 'ETH' ? parseFloat((prev.ethBalance + cryptoVal).toFixed(3)) : prev.ethBalance,
          pqcTokenBalance: selectedCrypto === '$PQC' ? prev.pqcTokenBalance + Math.round(cryptoVal) : prev.pqcTokenBalance,
        }));

        const newTx: InrTransaction = {
          id: `tx-${Date.now()}`,
          type: 'BUY_CRYPTO',
          chainId: wallet.chainId || 11155111,
          paymentMethod,
          cryptoAmount: cryptoVal,
          cryptoSymbol: selectedCrypto,
          inrAmount: inrVal,
          exchangeRate: selectedCrypto === 'ETH' ? ETH_INR_RATE : PQC_INR_RATE,
          status: 'SUCCESS',
          utrNumber: utr,
          txHash,
          timestamp: new Date().toLocaleString(),
        };

        setTransactions((prev) => [newTx, ...prev]);
        setSelectedTxForReceipt(newTx);

        onAddTerminalMessage(
          `🇮🇳 INR ON-RAMP SUCCESS: Purchased ${cryptoVal} ${selectedCrypto} for ₹${inrVal.toLocaleString('en-IN')} via ${paymentMethod}. UTR: ${utr}.`
        );
      } else {
        // Selling Crypto for INR Bank Payout
        if (selectedCrypto === 'ETH' && wallet.ethBalance < cryptoVal) {
          alert('Insufficient ETH balance to sell!');
          setIsProcessing(false);
          return;
        }
        if (selectedCrypto === '$PQC' && wallet.pqcTokenBalance < cryptoVal) {
          alert('Insufficient $PQC token balance to sell!');
          setIsProcessing(false);
          return;
        }

        setWallet((prev) => ({
          ...prev,
          inrBalance: prev.inrBalance + inrVal,
          ethBalance: selectedCrypto === 'ETH' ? parseFloat((prev.ethBalance - cryptoVal).toFixed(3)) : prev.ethBalance,
          pqcTokenBalance: selectedCrypto === '$PQC' ? prev.pqcTokenBalance - Math.round(cryptoVal) : prev.pqcTokenBalance,
        }));

        const newTx: InrTransaction = {
          id: `tx-${Date.now()}`,
          type: 'SELL_CRYPTO',
          chainId: wallet.chainId || 11155111,
          paymentMethod,
          cryptoAmount: cryptoVal,
          cryptoSymbol: selectedCrypto,
          inrAmount: inrVal,
          exchangeRate: selectedCrypto === 'ETH' ? ETH_INR_RATE : PQC_INR_RATE,
          status: 'SUCCESS',
          utrNumber: utr,
          txHash,
          timestamp: new Date().toLocaleString(),
        };

        setTransactions((prev) => [newTx, ...prev]);
        setSelectedTxForReceipt(newTx);

        onAddTerminalMessage(
          `🇮🇳 INR OFF-RAMP SUCCESS: Sold ${cryptoVal} ${selectedCrypto} for ₹${inrVal.toLocaleString('en-IN')} transferred to Bank via IMPS/UPI. UTR: ${utr}.`
        );
      }

      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden rounded-xl border border-slate-800">
      {/* Top Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            INDIAN RUPEE (INR - ₹) CRYPTO EXCHANGE & FIAT ON-RAMP
          </h2>
          <p className="text-[11px] text-slate-400">
            Instant UPI, Paytm, GPay, PhonePe & NetBanking Crypto Gateway
          </p>
        </div>

        {/* Live Ticker Pills */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <span className="text-slate-400">1 ETH =</span>
            <span className="text-emerald-400 font-bold">₹{ETH_INR_RATE.toLocaleString('en-IN')}</span>
            <TrendingUp className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <span className="text-slate-400">1 $PQC =</span>
            <span className="text-cyan-400 font-bold">₹{PQC_INR_RATE.toFixed(2)}</span>
            <TrendingUp className="w-3 h-3 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col md:flex-row gap-6">
        {/* Left Form: Buy/Sell Exchange Form */}
        <div className="w-full md:w-1/2 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl space-y-4 font-mono">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('BUY')}
              className={`flex-1 py-1.5 rounded-md transition font-bold ${
                activeTab === 'BUY' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Buy Crypto with INR (₹)
            </button>
            <button
              onClick={() => setActiveTab('SELL')}
              className={`flex-1 py-1.5 rounded-md transition font-bold ${
                activeTab === 'SELL' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sell Crypto for INR Bank
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-3 py-1.5 rounded-md transition font-bold flex items-center gap-1 ${
                activeTab === 'HISTORY' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
          </div>

          {activeTab !== 'HISTORY' ? (
            <div className="space-y-4 text-xs">
              {/* Asset Selector */}
              <div>
                <label className="block text-slate-400 mb-1">Select Crypto Asset</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedCrypto('ETH');
                      handleInrChange(inrAmountInput);
                    }}
                    className={`p-2.5 rounded-lg border flex items-center justify-between transition ${
                      selectedCrypto === 'ETH'
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>Ethereum (ETH)</span>
                    <span className="text-[10px] text-emerald-400 font-sans">₹2.85 Lakh</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCrypto('$PQC');
                      handleInrChange(inrAmountInput);
                    }}
                    className={`p-2.5 rounded-lg border flex items-center justify-between transition ${
                      selectedCrypto === '$PQC'
                        ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>PQC Token ($PQC)</span>
                    <span className="text-[10px] text-cyan-400 font-sans">₹85.50</span>
                  </button>
                </div>
              </div>

              {/* Amount Inputs */}
              <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Amount in Indian Rupees (₹ INR)</span>
                    <span>Balance: ₹{wallet.inrBalance.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={inrAmountInput}
                      onChange={(e) => handleInrChange(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-bold text-sm focus:outline-none focus:border-emerald-500 pl-8"
                    />
                    <span className="absolute left-3 top-2.5 text-emerald-400 font-bold">₹</span>
                  </div>
                </div>

                <div className="flex justify-center my-1">
                  <ArrowLeftRight className="w-4 h-4 text-slate-500" />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Crypto You {activeTab === 'BUY' ? 'Receive' : 'Pay'}</span>
                    <span>
                      Wallet: {selectedCrypto === 'ETH' ? `${wallet.ethBalance} ETH` : `${wallet.pqcTokenBalance} $PQC`}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={cryptoAmountInput}
                    onChange={(e) => handleCryptoChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-bold text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Indian Payment Option Selection */}
              <div>
                <label className="block text-slate-400 mb-1.5">Select Indian Payment Option</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('UPI_GPAY')}
                    className={`p-2 rounded-lg border text-left text-[11px] flex items-center gap-1.5 transition ${
                      paymentMethod === 'UPI_GPAY'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    GPay UPI
                  </button>

                  <button
                    onClick={() => setPaymentMethod('UPI_PHONEPE')}
                    className={`p-2 rounded-lg border text-left text-[11px] flex items-center gap-1.5 transition ${
                      paymentMethod === 'UPI_PHONEPE'
                        ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5 text-purple-400" />
                    PhonePe
                  </button>

                  <button
                    onClick={() => setPaymentMethod('UPI_PAYTM')}
                    className={`p-2 rounded-lg border text-left text-[11px] flex items-center gap-1.5 transition ${
                      paymentMethod === 'UPI_PAYTM'
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                    Paytm UPI
                  </button>

                  <button
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-2 rounded-lg border text-left text-[11px] flex items-center gap-1.5 transition ${
                      paymentMethod === 'NETBANKING'
                        ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    IMPS NetBanking
                  </button>

                  <button
                    onClick={() => setPaymentMethod('DEBIT_CARD')}
                    className={`p-2 rounded-lg border text-left text-[11px] flex items-center gap-1.5 transition col-span-2 sm:col-span-1 ${
                      paymentMethod === 'DEBIT_CARD'
                        ? 'bg-indigo-950 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                    RuPay / Visa Card
                  </button>
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Exchange Rate:</span>
                  <span className="text-slate-200">
                    1 {selectedCrypto} = ₹{selectedCrypto === 'ETH' ? ETH_INR_RATE.toLocaleString('en-IN') : PQC_INR_RATE}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>TDS / Indian Crypto Tax (Simulated):</span>
                  <span className="text-slate-200">1% Compliant</span>
                </div>
                <div className="flex justify-between font-bold text-slate-200 pt-1 border-t border-slate-800">
                  <span>Total Payable:</span>
                  <span className="text-emerald-400">₹{parseFloat(inrAmountInput || '0').toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleExecuteSwap}
                disabled={isProcessing}
                className={`w-full py-2.5 rounded-lg text-white font-bold font-sans text-xs shadow-lg transition flex items-center justify-center gap-2 ${
                  activeTab === 'BUY'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing Payment via {paymentMethod}...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {activeTab === 'BUY' ? `Buy ${cryptoAmountInput} ${selectedCrypto} Now` : `Sell for ₹${inrAmountInput} Bank Payout`}
                  </>
                )}
              </button>
            </div>
          ) : (
            /* History Tab */
            <div className="space-y-3 font-mono text-xs">
              <h3 className="font-bold text-slate-300">Indian Rupee (INR) Transaction Ledger</h3>
              {transactions.length === 0 ? (
                <div className="text-slate-500 text-center py-8">No transactions found.</div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTxForReceipt(tx)}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] ${
                            tx.type === 'BUY_CRYPTO' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                          }`}
                        >
                          {tx.type === 'BUY_CRYPTO' ? 'BUY' : 'SELL'}
                        </span>
                        {tx.cryptoAmount} {tx.cryptoSymbol}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{tx.timestamp}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">₹{tx.inrAmount.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-cyan-400">{tx.paymentMethod}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Panel: GST & Web3 Payment Receipt Preview */}
        <div className="w-full md:w-1/2 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between font-mono">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                GST COMPLIANT INR PAYMENT RECEIPT
              </h3>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-800">
                INSTANT SETTLED
              </span>
            </div>

            {selectedTxForReceipt ? (
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>TRANSACTION ID:</span>
                  <span className="text-slate-200 font-bold">{selectedTxForReceipt.id}</span>
                </div>

                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>UTR REF NUMBER:</span>
                  <span className="text-cyan-300 font-bold">{selectedTxForReceipt.utrNumber}</span>
                </div>

                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>PAYMENT MODE:</span>
                  <span className="text-emerald-400 font-bold">{selectedTxForReceipt.paymentMethod}</span>
                </div>

                <div className="border-t border-slate-800 pt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>INR Amount Settled:</span>
                    <span className="text-emerald-400 font-bold">₹{selectedTxForReceipt.inrAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crypto Credited:</span>
                    <span className="text-cyan-300 font-bold">
                      {selectedTxForReceipt.cryptoAmount} {selectedTxForReceipt.cryptoSymbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exchange Rate:</span>
                    <span className="text-slate-400">
                      ₹{selectedTxForReceipt.exchangeRate.toLocaleString('en-IN')} / {selectedTxForReceipt.cryptoSymbol}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[10px] text-slate-400 space-y-0.5">
                  <div>ETHEREUM TX HASH:</div>
                  <div className="text-slate-300 font-bold select-all truncate">{selectedTxForReceipt.txHash}</div>
                </div>

                <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
                  <span>Verified by Post-Quantum Signatures</span>
                  <span>Date: {selectedTxForReceipt.timestamp}</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center text-slate-500 text-xs space-y-2">
                <QrCode className="w-8 h-8 text-slate-600 mx-auto" />
                <div>Execute a buy or sell order to view live GST compliant Indian Rupee payment receipt & UTR record.</div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              Supported Gateways: GPay, PhonePe, Paytm, BHIM, IMPS
            </span>
            <button
              onClick={() => alert('Downloading PDF Tax Receipt...')}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-sans flex items-center gap-1"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              Download GST Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
