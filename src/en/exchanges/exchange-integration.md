# Exchange Integration

### This section contains information on integrating your exchange with our solution.

This is necessary so that a merchant can:

- request the current exchange rates of currencies,
- check their current balance on the exchange,
- exchange their currency according to the established exchange rules,
- withdraw currency according to the established withdrawal rules.

We will also explain how the currency withdrawal function from the exchange works.  
You set the "Minimum withdrawal amount" - "X" in the withdrawal interface, and based on this setting, the merchant
requests the exchange to withdraw currency only from the value X. It is necessary to consider the block confirmation
process, and that the balance displayed on the exchange does not always mean the possibility of withdrawing all
displayed funds. Sometimes, block confirmation must be awaited. Our function, when it sees a balance but cannot withdraw
it, reduces the withdrawal amount by $10 and tries again to make the withdrawal, continuing with this step downward
until the funds are withdrawn.  
*It follows that the amount of funds withdrawn does not always correspond to the minimum withdrawal rule.