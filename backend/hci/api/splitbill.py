#To handle splitting bill, transfering debt, adding and removing debt, manually adding debt, and 
#proportionaly adding debt, precomputes values for the graph, and plot graph

#the class "expense" is to be invoced whenever a user addes a new expense
#the class "Trip" will be the main class of the whole Trip and will contain multiple 
#subclasses of expense.
from collections import defaultdict
import matplotlib.pyplot as plt

class Trip:
    class expense: 
       #varaibales for the graph
        debt_counter={"a":1,"b":2,"c":3}
        rembursment_counter={"a":1, "b":2}

        
        
        def __init__(self):
            self.debts = defaultdict(lambda: defaultdict(float))
        
        
        #This function will be called everytime we add or remove an expense
        def transfer_debt(self, remburser, candidate):
            while remburser!=candidate:
                for person_2, amount in self.debts[candidate].items():
                    self.debts[remburser][person_2] += amount
                    self.debt_counter[remburser]+=amount
                    self.rembursment_counter[person_2]+=amount
                    self.rembursment_counter[candidate]-=amount
                    del self.debts[candidate]
                    self.debt_counter[candidate]-=amount
        
        
        def add_debt(self, candidate, payer, owe):
            while payer!=candidate:
                self.debts[candidate][payer] +=owe
                self.debt_counter[candidate]+=owe
                self.rembursment_counter[payer]+=owe
                self.transfer_debt( candidate, payer)

        def AddDebt_manualy(self,candidate,payer,amount):
            #candidate and amount are lists
             for i in range(len(candidate)):
                self.debts[candidate[i]][payer] += amount[i]
                self.debt_counter[candidate[i]]+= amount[i]
                self.rembursment_counter[payer]+=amount

        def SplitBills_default(self,amount,payer,participants):
            #participants is a set
            count=len(participants)
            owe=amount/count
            self.add_debt(self,(lambda x: x in self.debts[participants[lambda i: i in participants]]), payer, owe)
            
        
        
        def remove_debt(self,rembursor,amount,candidate):
            while rembursor!=candidate:
                self.debts[rembursor][candidate]-=amount
                self.debt_counter[rembursor]-=amount
                self.rembursment_counter[candidate]-=amount

        def get_total_debt(self, person):
            return self.debt_counter[person]
        


        def SplitBills_proportion(self,amount,proportions,payer,participants):
            #participants is a 
            #proportions is a list
            if sum(proportions)!= 1:
                raise ValueError("Percentage proportions need to sum up to 1!")
            else: 
                for i in range(len(participants)):
                    self.debts[participants[i]][payer] += amount*proportions[i]
                    self.debt_counter[participants[i]]+= amount*proportions[i]
                    self.rembursment_counter[payer]+=amount
        
        def plot_graph(self,debt, rembursment):
            debt= self.debt_counter
            rembursment=self.rembursment_counter
            key1 = list(debt.keys())
            value1 = list(debt.values())

            key2 = list(rembursment.keys())
            value2 = list(rembursment.values())

            plt.figure(figsize=(10, 6))
            plt.plot(key1, value1, marker='o', label='Debt Graph')
            plt.plot(key2, value2, marker='o', label='Rembursemnt Graph')
            plt.xlabel('Participants')
            plt.ylabel('Amount')
            plt.title('Debt vs Rembursment')
            plt.legend()
            plt.grid(True)
            plt.show()

        
       
if __name__ == "__main__":
    a = Trip()
    b = a.expense()
    b.AddDebt_manualy("a","b", [30])
    print(b.debts)
    b.plot_graph(b.debt_counter,b.rembursment_counter )

  