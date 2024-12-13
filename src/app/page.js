"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "@/styles/styles.scss";
import Toolbar from "./components/toolbar";

export default function Home() {
  return (
    <div className="App">
      <Toolbar />
    </div>
  );
}
