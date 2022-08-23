# Formula
# Final Capital = Initial Capital * (1 + r/n)^(nt)
# r = annual interest rate
# n = number of times is compounded
# t = the amount of time that the money is invested (default this to 1 year)

# Getting the updated compounded_rate:
# compounded_rate = (Final Capital / Initial Capital) - 1
#                 = ((Initial Capital * (1 + r/n)^(nt)) / Initial Capital) - 1
#                 = ((1 + r/n)^(nt)) - 1

# Getting the updated compounded_rates with fees considered
# compounded_rate = ((Final Capital - fee) / Initial Capital) - 1
#                 = ((Initial Capital * (1 + r/n)^(nt) - fee) / Initial Capital) - 1
#                 = ((1 + r/n)^(nt)) - (fee/Initial Capital) - 1
#                 = ((1 + r/n)^(nt)) - (0.001*n / Initial Capital) - 1

# Example
# 100 @ 20% (1 time) --> $120 --> rate = 20%
# 100 @ 20% (12 times) --> $121.94 --> rate = 21.94%

def get_annualized_compounded_rate(initial_capital, annual_rate, compound_frequency):
  '''
  initial_capital is the capital you start off with
  annual_rate is the annual APR rate
  compound_frequency is the frequency you want to compound in years. Ex: monthly is 12, daily is 365, hourly is 8,760
  return: new annualized compounded rate APR
  '''
  # final_capital = initial_capital * (1 + annual_rate/compound_frequency)**(compound_frequency)
  return round((((1 + annual_rate/compound_frequency) ** compound_frequency)) - (0.001*compound_frequency / initial_capital) - 1,2)