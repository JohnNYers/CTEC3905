/*
 * Created by SharpDevelop.
 * User: yew
 * Date: 07.12.2017
 * Time: 18:05
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Net;
using System.IO;
using System.Net.Sockets;
using System.Threading;

namespace ProxyWebServer
{
	class Program
	{
		public static void Main(string[] args)
		{
			Console.ForegroundColor = ConsoleColor.Yellow;
			Console.WriteLine("INITIALIZING proxy server...");
			Console.WriteLine("listening for TCP connection on localhost (127.0.0.1) and port 12346\n...");
			TcpListener server = new TcpListener(IPAddress.Loopback, 12346);
			server.Start();
			Console.ForegroundColor = ConsoleColor.Green;
			Console.WriteLine("TCPlistener started!");
			Console.ResetColor();
			while(true) {
				TcpClient c = server.AcceptTcpClient();
				//new Thread(() => Serve(c)).Start();
				Serve(c);
			}
		}
		public static void Serve(TcpClient client)
		{
			Console.WriteLine("Client connected");
			StreamWriter writer = new StreamWriter( client.GetStream() );
			StreamReader reader = new StreamReader( client.GetStream());
			Console.ForegroundColor=ConsoleColor.DarkMagenta;
			if(reader.Peek() != -1)
			{
				string plain = reader.ReadLine();
				Console.WriteLine(plain);
				string[] request = plain.Split(' ');
				if(request.Length != 3) 
				{
					client.Close();
					return;
				}
				if(request[1] == "/")
					request[1] = "/index.php";
				
				sendHTTP(request[1], writer);
			}
			while(reader.Peek() != -1) Console.WriteLine(reader.ReadLine());
			Console.ForegroundColor = ConsoleColor.Red;
			Console.WriteLine("<Request Finished>\n> ");
			Console.ResetColor();
			client.Close();
		}
		
		private static void sendHTTP(string data, StreamWriter writer)
		{
			Console.WriteLine("requested: " + "http://wetter-maulburg.de" + data);
			HttpWebRequest request = (HttpWebRequest) WebRequest.Create("http://wetter-maulburg.de" + data);
			try {
				StreamReader r = new StreamReader(request.GetResponse().GetResponseStream());
				writer.Write("HTTP/1.1 200 OK\r\n");
				writer.Write("Content-Type: text/html; charset=UTF-8\r\n");
				writer.Write("Content-Encoding: UTF-8\r\n");
				writer.Write("Accept-Ranges: bytes\r\n");
				writer.Write("Connection: close\r\n");
				writer.Write("\r\n");
				while(r.Peek() != -1) writer.WriteLine(r.ReadLine());
				writer.Write("\r\n");
				writer.Write("\r\n");
				writer.Flush();
			}
			catch(Exception e)
			{
				Console.ForegroundColor = ConsoleColor.Red;
				Console.WriteLine("error");
			}
		}
	}
}