pragma solidity ^0.5.0;

import "./Token.sol"

contract EthSwap{
	string public name = "EthSwap Instant Exchange";
	Token public token;
	uint public rate = 100;

	event TokensPurchased(
		address account,
		address token,
		uint amount,
		uint rate
	);

	event TokensSold(
		address account,
		address token,
		uint amount,
		uint rate
	);

		constructor(Token _token)  public {
		token = _token;
	}

	function buyTokens() public payable {
		//redumption rate = number of token they recive per 1 ether

		uint tokenAmount = msg.value * rate;

		//require ethSwap has enough tokens
		require(token.balanceOf(address(this)) >= tokenAmount);

		token.transfer(msg.sender,tokenAmount);

		// Emit an event
		emit TokensPurchased(msg.sender, address(token),tokenAmount,rate);

	}

	function sellTokens(uint _amount) public{
		// user can't sell more tokens then they have
		require(token.balanceOf(msg.sender)>= _amount);


		//Calculate the amount of ether to redeem
		uint etherAmount  = _amount / rate;

		//Require ethswap has enough Ether
		require(address(this).balance >= etherAmount);

		//perform sale
		token.transferFrom(msg.sender,address(this),_amount );
		msg.sender.transfer(etherAmount);

		// Emit an event
		emit TokensSold(msg.sender,address(token),_amount,rate);
	}

}

 