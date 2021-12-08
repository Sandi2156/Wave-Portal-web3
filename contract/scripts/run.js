const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1'),
    });
    await waveContract.deployed();

    console.log("waveContract address : ", waveContract.address);

    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance : ", hre.ethers.utils.formatEther(contractBalance));

    const WaveTxn = await waveContract.wave("I am waving at you");
    const waveTxn = await WaveTxn.wait();

    console.log(waveTxn.events[0].args);

    let allWaves = await waveContract.getAllWaves();
    // console.log(allWaves);

}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();