const main = async () => {
    const WaveContract = await hre.ethers.getContractFactory('EventTesting');
    const waveContract = await WaveContract.deploy();
    await waveContract.deployed();

    const temp = await waveContract.store();
    const temp2 = await temp.wait();

    console.log(temp2);
}

main().catch(error => {
    console.log(error);
})