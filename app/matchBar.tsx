'use client'

import React, { useState } from 'react'
import Image from "next/image"

export default function MatchBar({percent_match, accept_cutoff}) {
	if (percent_match == null) return null;
	const accept_color = "#16a34a"
	const reject_color = "red"
	const color = (percent_match > accept_cutoff ? accept_color : reject_color);
	return (
		<div className="h-6 w-full bg-gray-300 rounded-full overflow-hidden">
		    <div
		        className="h-full rounded-full transition-all duration-300"
		        style={{
		        	width: `${100*percent_match}%`,
		        	backgroundColor: color
		       	}}
		    >
		    <div
			    style = {{
			     	width: 200,
			     	height: 100
			    }}
		    ></div>
		    </div>
		</div>
	);
}