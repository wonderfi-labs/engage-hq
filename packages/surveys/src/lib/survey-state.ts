import { TResponseUpdate } from "@formbricks/types/responses";

export class SurveyState {
  responseId: string | null = null;
  displayId: string | null = null;
  userId: string | null = null;
  contactId: string | null = null;
  surveyId: string;
  responseAcc: TResponseUpdate = { finished: false, data: {}, ttc: {}, variables: {} };
  singleUseId: string | null;
  dataHash: string | null = null;
  transactionHash: string | null = null;

  constructor(
    surveyId: string,
    singleUseId?: string | null,
    responseId?: string | null,
    userId?: string | null,
    contactId?: string | null,
    dataHash?: string | null,
    transactionHash?: string | null
  ) {
    this.surveyId = surveyId;
    this.userId = userId ?? null;
    this.singleUseId = singleUseId ?? null;
    this.responseId = responseId ?? null;
    this.contactId = contactId ?? null;
    this.dataHash = dataHash ?? null;
    this.transactionHash = transactionHash ?? null;
  }

  /**
   * Set the current survey ID
   * @param id - The survey ID
   */
  setSurveyId(id: string) {
    this.surveyId = id;
    this.clear(); // Reset the state when setting a new surveyId
  }

  /**
   * Update the dataHash
   * @param dataHash - The dataHash
   */
  updateDataHash(dataHash: string) {
    this.dataHash = dataHash;
  }

  /**
   * Update the dataHash
   * @param transactionHash - The dataHash
   */
  updateTransactionHash(transactionHash: string) {
    this.transactionHash = transactionHash;
  }

  /**
   * Get a copy of the current state
   */
  copy() {
    const copyInstance = new SurveyState(
      this.surveyId,
      this.singleUseId ?? undefined,
      this.responseId ?? undefined,
      this.userId ?? undefined,
      this.contactId ?? undefined,
      this.dataHash ?? undefined,
      this.transactionHash ?? undefined
    );
    copyInstance.responseId = this.responseId;
    copyInstance.responseAcc = this.responseAcc;
    return copyInstance;
  }

  /**
   * Update the response ID after a successful response creation
   * @param id - The response ID
   */
  updateResponseId(id: string) {
    this.responseId = id;
  }

  /**
   * Update the display ID after a successful display creation
   * @param id - The display ID
   */
  updateDisplayId(id: string) {
    this.displayId = id;
  }

  /**
   * Update the user ID
   * @param id - The user ID
   */
  updateUserId(id: string) {
    this.userId = id;
  }

  /**
   * Update the contact ID
   * @param id - The contact ID
   */
  updateContactId(id: string) {
    this.contactId = id;
  }

  /**
   * Accumulate the responses
   * @param responseUpdate - The new response data to add
   */
  accumulateResponse(responseUpdate: TResponseUpdate) {
    this.responseAcc = {
      finished: responseUpdate.finished,
      ttc: responseUpdate.ttc,
      data: { ...this.responseAcc.data, ...responseUpdate.data },
      variables: responseUpdate.variables,
      displayId: responseUpdate.displayId,
    };
  }

  /**
   * Check if the current accumulated response is finished
   */
  isResponseFinished() {
    return this.responseAcc.finished;
  }

  /**
   * Clear the current state
   */
  clear() {
    this.responseId = null;
    this.responseAcc = { finished: false, data: {}, ttc: {}, variables: {} };
  }
}
