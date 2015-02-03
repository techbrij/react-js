using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;

namespace VotingApp
{
    public class VotingHub : Hub
    {

        public static Dictionary<string, int> poll = new Dictionary<string, int>(){
             {"Apples",10 },
             {"Oranges",10},
             {"Bananas",10},
             {"Blueberries",10},
             {"mangoes",10},        
        };


        public void Send(string name)
        {
            poll[name]++;
            string data = JsonConvert.SerializeObject(poll.Select(x => new { name = x.Key, count = x.Value }).ToList());


            Clients.All.showLiveResult(data);
        }
    }

}