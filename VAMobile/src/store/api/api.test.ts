import _ from 'underscore'
import {get, post} from './api'

import { context, fetch } from 'testUtils'

context('api', () => {
	
	it("should handle GET requests", async ()=> {
		fetch.mockResolvedValue({status:200, json:()=>Promise.resolve({foo:"test"})})
		let result = await get("/foo")
		expect(result).toEqual(expect.objectContaining({foo:"test"}))
		
	})
	
	it("should handle GET request params", async ()=> {
		fetch.mockResolvedValue({status:200, json:()=>Promise.resolve({foo:"test"})})
		let result = await get("/foo", {p1:"test", p2:"t&=$?est", ary:["123", "asdfasdf,d,asfd", "%%%"]})
		expect(result).toEqual(expect.objectContaining({foo:"test"}))
		// query params should be properly escaped
		expect(fetch).toHaveBeenCalledWith("https://test-api/foo?p1=test&p2=t%26%3D%24%3Fest&ary=123&ary=asdfasdf%2Cd%2Casfd&ary=%25%25%25", expect.anything())
	})
	
	it("should handle 204 correctly", async ()=> {
		fetch.mockResolvedValue({status:204, json:()=>Promise.reject({foo:"test"})})
		let result = await get("/foo")
		expect(result).toEqual(undefined)
		// query params should be properly escaped
		expect(fetch).toHaveBeenCalledWith("https://test-api/foo", expect.anything())
	})
	
	it("should handle >399 errors correctly", async ()=> {
		fetch.mockResolvedValue({status:400, text:()=>Promise.resolve("status test")})
		expect(async ()=>get("/foo")).rejects.toBeCalled()
	})
	
	it("should handle POST correctly", async ()=> {
		fetch.mockResolvedValue({status:200, json:()=>Promise.resolve({res:"response"})})
		let result = await post("/foo", {p1:"test", p2:"t&=$?est", ary:["123", "asdfasdf,d,asfd", "%%%"]})
		
		let headers = expect.objectContaining({ 'Content-Type': 'application/json'})
		
		let body =  JSON.stringify({"p1":"test","p2":"t&=$?est","ary":["123","asdfasdf,d,asfd","%%%"]})
		
		expect(fetch).toHaveBeenCalledWith("https://test-api/foo", expect.objectContaining({method:"POST", body, headers}))
		expect(result).toEqual(expect.objectContaining({res:"response"}))
	})
	
})
