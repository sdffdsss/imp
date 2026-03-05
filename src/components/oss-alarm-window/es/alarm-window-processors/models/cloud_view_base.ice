/****************************************************************************/
/**
 *功能：本文件定义视图服务 ice模型
 *
 */

#pragma once

/**
 * 提供所有ice定义接口的基本数据模型 model
 */

module com 
{
module boco
{
module view
{
module slice
{
module generated
{
module model
{


	/****
	创建会话
	****/
	class CreateSessionRequest
	{
	  //客户端用户名称
	  string clientUserName;
	  //客户端Token信息
	  string clientToken;
	  //客户端描述
	  string clientDesc;
	  /****订阅的业务
	  	告警统计流水 AlarmStatisticsFlow
	  	告警过滤流水 AlarmFilteringFlow
	  	告警拓扑流水 AlarmTopologyFlow
	  ****/
	  string subscribeBusiness;
	  // 订阅信息集JSON（基于不同的订阅业务另行约定）
 	   string subscribeInfoJSON;
	};
	
	/****
	创建会话结果
	****/
	class CreateSessionResponse
	{
	  //客户端用户名称
	  string clientUserName;
	  //会话ID
	  string clientSessionId;
	  //处理描述描述
	  string dealDesc;
	  // 注册返回信息
	  string subscribeProperties;
	};
	/****
	关闭会话结果
	****/
	class CloseSessionResponse
	{
	
	  //会话ID
	  string clientSessionId;
	  //客户端在线时长
	  long clientOnlineTimeSecond;
	  //处理描述
	  string dealDesc;
	};
	/****
	通用接口模型,请求模型
	****/
	class RequestJSONMessage
	{
	   //请求方法名称
	  string requestMethodName;
	  //客户端请求时间(毫秒)
	  long  clientRequestTimeMS;
	  //客户端会话ID
	  string clientSessionId;
	  //请求参数JSON格式
	  string requestDataJSON;
	  
	};
	

	/****
	通用接口模型,返回数据模型
	****/
	class ResponseJSONMessage  
	{
		//客户端会话ID
	  	string clientSessionId;
	  	//客户端请求时间 ，毫秒值
	    long clientRequestTimeMS; 
	    //请求方法名称
	    string requestMethodName;
	    //返回数据JSON格式
	     string responseDataJSON;
	    //服务端处理耗时(毫秒)
	     long serverDealTimeMS;
	};
	
	/**
	* 服务的基本信息
	*/
	class ViewServiceInfo
	{
		/**
		* 服务名称
		*/
		string serviceName;
		/**
		* 服务地址信息
		*/
		string serviceAddress;
	};
	
	/**
	 * Ice服务统一抛出的服务异常，客户段通过判断错误代码来进行异常处理
	 */
	exception ViewServiceException
	{	
		/**
		* 错误代码
		*/
		string code;
		/**
		* 抛出异常的原因
		*/
		string reason;

		/**
		* 服务的基本信息
		* 用于服务客户段定位出问题的服务
		*/
		ViewServiceInfo info;
	};
	
	
	
};

/**
 * 提供所有ice定义接口的基本接口及方法
 */

module services
{


	interface IViewService
	{
	
	/**
		*生成Session
		**/
		["ami","amd"] model::CreateSessionResponse createSession(model::CreateSessionRequest createSessionRequest)throws model::ViewServiceException;
		/**
		*基于会话的业务方法执行
		**/
		["ami","amd"] model::ResponseJSONMessage executeMethodWithSession(model::RequestJSONMessage requestMessage)throws model::ViewServiceException;
		
		["ami","amd"] model::ResponseJSONMessage executeMethod(model::RequestJSONMessage requestMessage)throws model::ViewServiceException;
		/**
		*关闭Session
		**/
		["ami","amd"] model::CloseSessionResponse closeSession(string clientSessionId,string closeSessionDesc)throws model::ViewServiceException;
	};
	
	
};


//------end of current module define 
};
};
};
};
};

