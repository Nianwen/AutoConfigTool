import Q = require("q");

import TFS_Git_Client = require("TFS/VersionControl/GitRestClient");
import VCContracts = require("TFS/VersionControl/Contracts");
import VSS_Service = require("VSS/Service");
import Utils_String = require("VSS/Utils/String");

export class DataService {
    private _GIT_REF_ZERO_VALUE = "0000000000000000000000000000000000000000";
    private _gitClient;
    private _repositoryId = "aea43584-613e-4b6d-a9a8-6c63e4c80a58";
    constructor() {
        this._gitClient = TFS_Git_Client.getClient();
    }

    public createPR(service: string, milestone: string, name: string): IPromise<VCContracts.GitPullRequest> {
        let sourceRefName = "refs/heads/master";
        return this._gitClient.getRefs(this._repositoryId, undefined, this._getRefFilter(sourceRefName), undefined, undefined, undefined, undefined, true)
            .then(refs => {
                         this._gitClient.createPush(
                    {
                    "refUpdates": [{
                        "name": `refs/heads/${name}`,
                        "oldObjectId": refs[0].objectId
                    }],
                    "commits": [
                        {
                        "comment": "Test Comment",
                        "changes": [
                            {
                            "changeType": "add",
                            "item": {
                                "path": `/${service}/${milestone}/${name}/${name}.ps1`
                            },
                            "newContent": {
                                "content": "# Tasks\n\n* Item 1\n* Item 2",
                                "contentType": "rawtext"
                                }
                            }
                        ]
                        }
                    ]
                }, this._repositoryId)
            .then(push => {
               return this._gitClient.createPullRequest({
                    "sourceRefName": `refs/heads/${name}`,
                    "targetRefName": "refs/heads/master",
                    "title": "SampleTitle",
                    "description": "",
                    "reviewers": []
                    }, this._repositoryId, undefined, true, true);
            });
        });
    }

    // public createRef(newBranchName: string): IPromise<VCContracts.GitRefUpdate> {
    //         let sourceRefName = "refs/heads/master";
    //         let newRefName = "refs/heads/" + newBranchName;
    //         let refUpdatesPromise: IPromise<VCContracts.GitRefUpdateResult[]>
            
    //        // First get a minimal ref object with peeledObjectId if an annotated tag
    //        refUpdatesPromise = this._gitClient.getRefs(this._repositoryId, undefined, this._getRefFilter(sourceRefName), undefined, undefined, undefined, undefined, true)
    //                .then(refs => {
    //                     return refs[0];
    //                 })
    //                 .then(ref => {
    //                     const commitId = ref.peeledObjectId || ref.objectId;
    //                     return this._gitClient.updateRefs([this._refUpdate(newRefName, this._GIT_REF_ZERO_VALUE, commitId)], this._repositoryId);
    //         });
    //         return refUpdatesPromise.then(refUpdates => {
    //             return refUpdates[0];
    //         });
    // }

    //     /**
    //      * Helper method for creating a GitRefUpdate as required for the Http client
    //      */
    //     private _refUpdate(name: string, oldObjectId: string, newObjectId: string): VCContracts.GitRefUpdate {
    //         return <VCContracts.GitRefUpdate>{
    //             name,
    //             newObjectId,
    //             oldObjectId
    //         };
    //     }

        /**
         * The refs filter query parameter requires omitting the "refs/" prefix if present. Ex: "heads/myBranchName"
         */
        private _getRefFilter(refName: string): string {
            return (refName.indexOf("refs/") === 0) ? refName.substr("refs/".length) : refName;
        }
}

