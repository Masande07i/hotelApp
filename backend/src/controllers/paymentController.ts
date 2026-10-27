import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";
import { generatePayFastSignature } from "../utils/payfast";
import crypto from "crypto";