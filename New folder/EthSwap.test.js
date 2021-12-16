const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');

require('chai')
	.use(require('chai-as-promised'))
	.should()


function tokens(n){
	return web3.utils.toWei(n,'ether');
}

contract('EthSwap',([deployer,invester]) =>{
	let token, ethSwap

	before(async() =>{
		token = await Token.new()
		ethSwap = await Ethswap.new(token.address)
		//Transfer token to EthSwap(1 million)
  await token.transfer(ethSwap.address,tokens('1000000'))

	})

	describe('Token deployment', async () =>{
		it('contract has a name', async() =>{
			const name = await token.name()
			assert.equal(name,'DApp Token')
		})
	})

	describe('EthSwap deployment', async () =>{
		it('contract has a name', async() =>{
			const name = await ethSwap.name()
			assert.equal(name,'EthSwap Instant Exchange')
		})
	
		it('contract has tokens', async () => {
      		let balance = await token.balanceOf(ethSwap.address)
      		assert.equal(balance.toString(), tokens('1000000'))
    	})
	})

	describe('buyTokens()', async () =>{
		let results
		before(async() =>{
			//purchase tokens before each example
			 

			 resul

			 t = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
    	})

		it('Allows user to instantly purchase tokens from ethSwap for a fixed price',async ()=>{
			//check investor token balannce after purchase
			let investerBalance = await balanceOf(invester)
			assert.equal(investerBalance.toString(),tokens('100'))

			//check ethSwap balance after purchase
			let ethSwapBalance 
			ethSwapBalance = await token.balanceOf(ethSwap.address)
			assert.equal(ethSwapBalance.toString(), tokens('999900'))
			ethSwapBalance = await web3.eth.getBalance(ethSwap.balance)
			assert.equal(ethSwapBalance.toString(),web3.utils.toWei('1','Ether'))

			// Check logs to ensure event was emitted with correct data
			const event = result.log[0].args
			assert.equal(event.account,investor)
			assert.equal(event.token, token.address)
			assert.equal(event.amount.toString(),tokens('100').toString())
			assert.equal(event.rate.toString(),'100')
		})
	})	


	describe('sellTokens()', async () =>{
		let results
		before(async() =>{
			//investor must approve tokens before the purchase
			await token.approve(ethSwap.address, tokens('100'),{from : investor})
			//investor sells tokens
			result = await ethSwap.sellTokens(tokens('100'), {from: investor})


    	})

		it('Allows user to instantly sell  tokens from ethSwap for a fixed price',async ()=>{
			//check investor token balannce after selll
			let investerBalance = await balanceOf(invester)
			assert.equal(investerBalance.toString(),tokens('0'))


			//check ethSwap balance after purchase
			let ethSwapBalance 
			ethSwapBalance = await token.balanceOf(ethSwap.address)
			assert.equal(ethSwapBalance.toString(), tokens('1000000'))
			ethSwapBalance = await web3.eth.getBalance(ethSwap.balance)
			assert.equal(ethSwapBalance.toString(),web3.utils.toWei('0','Ether'))
			

			// Check logs to ensure event was emitted with correct data
			const event = result.log[0].args
			assert.equal(event.account,investor)
			assert.equal(event.token, token.address)
			assert.equal(event.amount.toString(),tokens('100').toString())
			assert.equal(event.rate.toString(),'100')

			//Investor can't sell more tokens then they have
			await ethSwap.sellTokens(tokens('500'), {from: investor}).should.be.rejected;

		})
	})	

})