const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log('Deploying contract from address ', deployer.address);
    console.log('Account Balance ', accountBalance.toString());

    const waveContract = await hre.ethers.getContractFactory('WavePortal');
    const portal = await waveContract.deploy({
        value: hre.ethers.utils.parseEther('0.01'),
    });
    await portal.deployed();

    console.log('WaveContract address  ', portal.address);
};

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